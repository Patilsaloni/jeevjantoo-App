import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getFirestore, collection, doc, setDoc, getDocs, updateDoc, getDoc,
  addDoc, query, where, deleteDoc, limit, orderBy, startAfter, serverTimestamp, WhereFilterOp, onSnapshot, Unsubscribe
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { environment } from '../../environments/environment';
import {
  getAuth, sendPasswordResetEmail,
  signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User
} from 'firebase/auth';

export type PetStatus = 'Pending' | 'Active' | 'Adopted' | 'Inactive';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app = initializeApp(environment.firebaseConfig);
  private db = getFirestore(this.app);
  private storage = getStorage(this.app);
  private auth = getAuth(this.app);

  constructor() {}

  // ---------------- Auth Methods ----------------
  async signIn(email: string, password: string) {
    if (!email || !password) throw new Error('Email and password are required.');
    const result = await signInWithEmailAndPassword(this.auth, email, password);
    return result.user;
  }

  async signUp(email: string, password: string) {
    if (!email || !password) throw new Error('Email and password are required.');
    const result = await createUserWithEmailAndPassword(this.auth, email, password);
    return result.user;
  }

  async signOutUser() {
    await signOut(this.auth);
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  async resetPasswordWithEmail(email: string) {
    await sendPasswordResetEmail(this.auth, email, {
      url: 'http://localhost:4200/signin',
      handleCodeInApp: true
    });
  }


  // ---------------- Real-Time Listener ----------------
listenToCollection(collectionName: string, onUpdate: (data: any[]) => void, onError: (error: any) => void): Unsubscribe {
  const colRef = collection(this.db, collectionName);
  return onSnapshot(colRef, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    onUpdate(data);
  }, onError);
}

  // ---------------- Firestore Generic Methods ----------------
  async addInformation(docID: string, data: any, collectionName: string) {
    const colRef = collection(this.db, collectionName);
    const docRef = doc(colRef, docID);
    await setDoc(docRef, data);
    return docRef.id;
  }

  async updateInformation(collectionName: string, docID: string, data: any) {
    const docRef = doc(this.db, collectionName, docID);
    await updateDoc(docRef, data);
  }

  async deleteInformation(collectionName: string, docID: string) {
    const docRef = doc(this.db, collectionName, docID);
    await deleteDoc(docRef);
  }

  async getInformation(collectionName: string) {
    const colRef = collection(this.db, collectionName);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  async getFilteredInformation(collectionName: string, field: string, operator: WhereFilterOp, value: any) {
    const colRef = collection(this.db, collectionName);
    const q = query(colRef, where(field, operator, value));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  async getPaginatedInformation(collectionName: string, pageSize: number, lastDoc: any = null) {
    const colRef = collection(this.db, collectionName);
    let q = query(colRef, orderBy('createdAt', 'desc'), limit(pageSize));
    if (lastDoc) q = query(colRef, orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(pageSize));
    const snapshot = await getDocs(q);
    return {
      data: snapshot.docs.map(d => ({ id: d.id, ...d.data() })),
      lastDoc: snapshot.docs[snapshot.docs.length - 1]
    };
  }

  async getDocument(collectionName: string, id: string) {
    const docRef = doc(this.db, collectionName, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  }

  // ---------------- Pet Methods ----------------
  async submitPet(petData: any) {
    const user = this.getCurrentUser();
    if (!user) throw new Error('User must be signed in to submit pets.');

    // Ensure Firestore doc id === saved "id" field
    const docID = `${petData.petName}_${Date.now()}`;

    const dataToSave = {
      ...petData,
      id: docID,                               // <-- align field with doc id
      status: 'Pending' as PetStatus,
      createdAt: serverTimestamp(),
      submitterUid: user.uid
    };

    return this.addInformation(docID, dataToSave, 'pet-adoption');
  }

  async updatePetStatus(docID: string, status: PetStatus) {
    if (!docID) throw new Error('Pet document ID is required to update status.');
    const docRef = doc(this.db, 'pet-adoption', docID);
    await updateDoc(docRef, { status, updatedAt: serverTimestamp() });
    return true;
  }

  async getActivePets() {
    return this.getFilteredInformation('pet-adoption', 'status', '==', 'Active');
  }

  // ---------------- Storage Methods ----------------
  async uploadFile(file: File, path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  }

  // ---------------- Favorites ----------------
  private favoriteCol(collectionName: string) {
    return `${collectionName}_favorites`;
  }

  private favoriteDocId(userUid: string, petId: string) {
    return `${userUid}_${petId}`;
  }

  /**
   * Save/remove favorite for current user.
   * - Accepts either pet id (string) or full pet object
   * - Writes minimal safe fields needed for list rendering
   */
  async setFavorite(collectionName: string, pet: any | string, value: boolean) {
    const user = this.getCurrentUser();
    if (!user) throw new Error('User must be signed in to manage favorites.');

    let petId: string;
    let petData: any;

    if (typeof pet === 'string') {
      petId = pet;
      const originalPet = await this.getDocument(collectionName, petId);
      if (!originalPet) throw new Error('Pet not found.');
      petData = originalPet;
    } else {
      petId = pet.id;
      petData = pet;
    }

    const favRef = doc(this.db, this.favoriteCol(collectionName), this.favoriteDocId(user.uid, petId));

    if (value) {
      // only persist necessary denormalized fields to render favorites quickly
      await setDoc(favRef, {
        id: petId,
        petName: petData.petName ?? '',
        species: petData.species ?? petData.category ?? '',
        category: petData.category ?? petData.species ?? '',
        photos: Array.isArray(petData.photos) ? petData.photos : [],
        image: petData.image ?? null,
        breed: petData.breed ?? '',
        age: petData.age ?? null,
        gender: petData.gender ?? '',
        contact: petData.contact ?? '',
        location: petData.location ?? '',
        remarks: petData.remarks ?? '',
        timings: petData.timings ?? '',
        favorite: true,
        userId: user.uid,
        updatedAt: serverTimestamp()
      });
    } else {
      await deleteDoc(favRef);
    }
  }

  async isFavorite(collectionName: string, petId: string): Promise<boolean> {
    const user = this.getCurrentUser();
    if (!user) return false;
    const favRef = doc(this.db, this.favoriteCol(collectionName), this.favoriteDocId(user.uid, petId));
    const snap = await getDoc(favRef);
    return snap.exists();
  }

  async toggleFavorite(collectionName: string, pet: any): Promise<boolean> {
    const isFav = await this.isFavorite(collectionName, pet.id);
    await this.setFavorite(collectionName, pet, !isFav);
    return !isFav;
  }

  /**
   * Fast helper to pre-mark heart icons on listing pages.
   * Returns Set of petIds that are favorited by current user.
   */
  async getFavoriteIds(collectionName: string): Promise<Set<string>> {
    const user = this.getCurrentUser();
    if (!user) return new Set();

    const favSnapshot = await getDocs(
      query(collection(this.db, this.favoriteCol(collectionName)), where('userId', '==', user.uid))
    );

    const ids = favSnapshot.docs.map(d => d.id.split('_')[1]);
    return new Set(ids);
  }

  /**
   * Get denormalized favorite pet cards to show in Favorites screen.
   */
  async getFavoritePets(collectionName: string): Promise<any[]> {
    const user = this.getCurrentUser();
    if (!user) return [];

    const favSnapshot = await getDocs(
      query(collection(this.db, this.favoriteCol(collectionName)), where('userId', '==', user.uid))
    );

    return favSnapshot.docs.map(d => {
      const petId = d.id.split('_')[1];
      const data: any = d.data();

      const image =
        Array.isArray(data.photos) && data.photos.length > 0
          ? data.photos[0]
          : (data.image || 'assets/default-pet.jpg');

      return {
        id: petId,
        petName: data.petName || 'Unknown',
        breed: data.breed || 'Unknown',
        age: data.age ?? 0,
        gender: data.gender || '',
        image,
        // normalize category/species for UI
        category: data.category || data.species || 'Unknown',
        favorite: true,
        contact: data.contact || '',
        location: data.location || 'Not available',
        remarks: data.remarks || '',
        timings: data.timings || 'Not available'
      };
    });
  }

  // ---------------- Reports ----------------
  async reportEntry(collectionName: string, id: string, reason: string) {
    const user = this.getCurrentUser();
    if (!user) throw new Error('User must be signed in to report entries.');
    const reportsRef = collection(this.db, 'reports');
    await addDoc(reportsRef, {
      collection: collectionName,
      id,
      reason,
      userId: user.uid,
      createdAt: new Date()
    });
  }

  async getReports() {
    const colRef = collection(this.db, 'reports');
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  }
}
