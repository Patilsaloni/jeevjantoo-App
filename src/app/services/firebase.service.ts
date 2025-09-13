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

  // ---------------- Firestore Methods ----------------
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
    if (!this.getCurrentUser()) throw new Error('User must be signed in to submit pets.');
    petData.status = 'Pending' as PetStatus;
    petData.createdAt = serverTimestamp();
    petData.submitterUid = this.getCurrentUser()!.uid;
    const docID = petData.petName + '_' + Date.now();
    return this.addInformation(docID, petData, 'pet-adoption');
  }

  async updatePetStatus(docID: string, status: PetStatus) {
    return this.updateInformation('pet-adoption', docID, { status });
  }

  async getActivePets() {
    return this.getFilteredInformation('pet-adoption', 'status', '==', 'Active');
  }

  // ---------------- Storage Methods ----------------
  async uploadFile(file: File, path: string): Promise<string> {
    if (!this.getCurrentUser()) throw new Error('User must be signed in to upload files.');
    const storageRef = ref(this.storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  // ---------------- Favorites & Reports ----------------
  async isFavorite(collectionName: string, id: string): Promise<boolean> {
    const favRef = doc(this.db, `${collectionName}_favorites`, id);
    const snap = await getDoc(favRef);
    return snap.exists();
  }

  async setFavorite(collectionName: string, id: string, value: boolean) {
    if (!this.getCurrentUser()) throw new Error('User must be signed in to manage favorites.');
    const favRef = doc(this.db, `${collectionName}_favorites`, id);
    if (value) {
      await setDoc(favRef, { favorite: true, updatedAt: new Date(), userId: this.getCurrentUser()!.uid });
    } else {
      await deleteDoc(favRef);
    }
  }

  async toggleFavorite(collectionName: string, id: string) {
    const isFav = await this.isFavorite(collectionName, id);
    await this.setFavorite(collectionName, id, !isFav);
    return !isFav;
  }

  async reportEntry(collectionName: string, id: string, reason: string) {
    if (!this.getCurrentUser()) throw new Error('User must be signed in to report entries.');
    const reportsRef = collection(this.db, 'reports');
    await addDoc(reportsRef, {
      collection: collectionName,
      id,
      reason,
      userId: this.getCurrentUser()!.uid,
      createdAt: new Date()
    });
  }

  async getReports() {
    const colRef = collection(this.db, 'reports');
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}
