import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, doc, setDoc, getDocs, updateDoc, getDoc, 
  addDoc, query, where, deleteDoc, limit, orderBy, startAfter, serverTimestamp 
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
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getFilteredInformation(collectionName: string, field: string, operator: any, value: any) {
    const colRef = collection(this.db, collectionName);
    const q = query(colRef, where(field, operator, value));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getPaginatedInformation(collectionName: string, pageSize: number, lastDoc: any = null) {
    const colRef = collection(this.db, collectionName);
    let q = query(colRef, orderBy("createdAt", "desc"), limit(pageSize));
    if (lastDoc) q = query(colRef, orderBy("createdAt", "desc"), startAfter(lastDoc), limit(pageSize));
    const snapshot = await getDocs(q);
    return {
      data: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
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
    petData.status = 'Pending' as PetStatus;
    petData.createdAt = serverTimestamp();
    petData.submitterUid = user.uid;
    const docID = petData.petName + '_' + Date.now();
    return this.addInformation(docID, petData, 'pet-adoption');
  }

    async updatePetStatus(docID: string, status: PetStatus) {
    if (!docID) throw new Error("Pet document ID is required to update status.");
    const docRef = doc(this.db, 'pet-adoption', docID);
    await updateDoc(docRef, { status, updatedAt: serverTimestamp() });
    return true;
  }


  async getActivePets() {
    return this.getFilteredInformation('pet-adoption', 'status', '==', 'Active');
  }

  // ---------------- Storage Methods ----------------
   async uploadFile(file: File, path: string): Promise<string> {
    const storage = getStorage();
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);          // File upload
    const downloadURL = await getDownloadURL(storageRef);  // URL get
    return downloadURL;
  }

  // ---------------- Favorites ----------------
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

    const favRef = doc(this.db, `${collectionName}_favorites`, `${user.uid}_${petId}`);

    if (value) {
      await setDoc(favRef, {
        ...petData,
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
    const favRef = doc(this.db, `${collectionName}_favorites`, `${user.uid}_${petId}`);
    const snap = await getDoc(favRef);
    return snap.exists();
  }

  async toggleFavorite(collectionName: string, pet: any): Promise<boolean> {
    const isFav = await this.isFavorite(collectionName, pet.id);
    await this.setFavorite(collectionName, pet, !isFav);
    return !isFav;
  }

 async getFavoritePets(collectionName: string): Promise<any[]> {
  const user = this.getCurrentUser();
  if (!user) return [];

  const favSnapshot = await getDocs(
    query(
      collection(this.db, `${collectionName}_favorites`),
      where('userId', '==', user.uid)
    )
  );

  return favSnapshot.docs.map(doc => {
    const petId = doc.id.split('_')[1]; // extract original pet id
    const data = doc.data();

    return {
      id: petId,
      petName: data['petName'] || 'Unknown',
      breed: data['breed'] || 'Unknown',
      age: data['age'] || 0,
      gender: data['gender'] || '',
      image: data['image'] || 'assets/default-pet.jpg',
      category: data['category'] || 'Unknown',
      favorite: true,
      contact: data['contact'] || '',
      location: data['location'] || 'Not available',
      remarks: data['remarks'] || '',
      timings: data['timings'] || 'Not available',
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
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}
