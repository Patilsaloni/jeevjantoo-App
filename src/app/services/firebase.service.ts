// firebase.service.ts
import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { environment } from '../../environments/environment';

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

  async getInformation(collectionName: string) {
    const colRef = collection(this.db, collectionName);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Add other methods: updateInformation, deleteInformation, etc.
}
