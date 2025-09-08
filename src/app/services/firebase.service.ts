// firebase.service.ts
import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, updateDoc, query, where, deleteDoc } from 'firebase/firestore';
import { environment } from '../../environments/environment';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app = initializeApp(environment.firebaseConfig);
  private db = getFirestore(this.app);

  constructor() {}

  // Add information with custom docID
  async addInformation(docID: string, data: any, collectionName: string) {
    const colRef = collection(this.db, collectionName);
    const docRef = doc(colRef, docID);
    await setDoc(docRef, data);
    return docRef.id;
  }

  // Get all documents in a collection
  async getInformation(collectionName: string) {
    const colRef = collection(this.db, collectionName);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Update a document by ID
  async updateInformation(collectionName: string, docID: string, data: any) {
    const docRef = doc(this.db, collectionName, docID);
    await updateDoc(docRef, data);
  }

  // Delete a document by ID
  async deleteInformation(collectionName: string, docID: string) {
    const docRef = doc(this.db, collectionName, docID);
    await deleteDoc(docRef);
  }

  // 🔹 Reset password via email (Firebase handles the secure reset)
  async resetPasswordWithEmail(email: string) {
    const auth = getAuth(this.app);
    try {
      await sendPasswordResetEmail(auth, email, {
        url: 'http://localhost:4200/signin', // redirect after reset
        handleCodeInApp: true
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send reset email');
    }
  }

async getCategoryCount(collectionName: string): Promise<number> {
  const colRef = collection(this.db, collectionName);
  const snapshot = await getDocs(colRef);
  return snapshot.size; // number of documents in collection
}



}
