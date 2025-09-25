import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  getDoc,
  addDoc,
  query,
  where,
  deleteDoc,
  limit,
  orderBy,
  startAfter,
  serverTimestamp,
  WhereFilterOp,
  onSnapshot,
  Unsubscribe,
  arrayUnion,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { environment } from '../../environments/environment';
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';

export type PetStatus = 'Pending' | 'Active' | 'Adopted' | 'Inactive';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private app = initializeApp(environment.firebaseConfig);
  private db = getFirestore(this.app);
  private storage = getStorage(this.app);
  private auth = getAuth(this.app);

  constructor() {}

  // ---------------- Auth Methods ----------------
  async signIn(email: string, password: string) {
    if (!email || !password)
      throw new Error('Email and password are required.');
    const result = await signInWithEmailAndPassword(this.auth, email, password);
    return result.user;
  }

  async signUp(email: string, password: string) {
    if (!email || !password)
      throw new Error('Email and password are required.');
    const result = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    return result.user;
  }

  async signOutUser() {
    await signOut(this.auth);
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  /** Small helper you can call from components */
  currentUid(): string | null {
    return this.auth.currentUser?.uid ?? null;
  }

  async resetPasswordWithEmail(email: string) {
    await sendPasswordResetEmail(this.auth, email, {
      url: 'http://localhost:4200/signin',
      handleCodeInApp: true,
    });
  }

  // ---------------- Real-Time Listener ----------------
  listenToCollection(
    collectionName: string,
    onUpdate: (data: any[]) => void,
    onError: (error: any) => void
  ): Unsubscribe {
    const colRef = collection(this.db, collectionName);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        onUpdate(data);
      },
      onError
    );
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
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  async getFilteredInformation(
    collectionName: string,
    field: string,
    operator: WhereFilterOp,
    value: any
  ) {
    const colRef = collection(this.db, collectionName);
    const q = query(colRef, where(field, operator, value));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  async getPaginatedInformation(
    collectionName: string,
    pageSize: number,
    lastDoc: any = null
  ) {
    const colRef = collection(this.db, collectionName);
    let q = query(colRef, orderBy('createdAt', 'desc'), limit(pageSize));
    if (lastDoc)
      q = query(
        colRef,
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(pageSize)
      );
    const snapshot = await getDocs(q);
    return {
      data: snapshot.docs.map((d) => ({ id: d.id, ...d.data() })),
      lastDoc: snapshot.docs[snapshot.docs.length - 1],
    };
  }

  async getDocument(collectionName: string, id: string) {
    const docRef = doc(this.db, collectionName, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  }

  // ---------------- Pet Methods ----------------
  // async submitPet(petData: any) {
  //   const user = this.getCurrentUser();
  //   if (!user) throw new Error('User must be signed in to submit pets.');

  //   // Ensure Firestore doc id === saved "id" field
  //   const docID = `${petData.petName}_${Date.now()}`;

  //   const dataToSave = {
  //     ...petData,
  //     id: docID,                            // align field with doc id
  //     status: 'Pending' as PetStatus,
  //     createdAt: serverTimestamp(),
  //     submitterUid: user.uid,
  //     ownerUid: user.uid                    // ✅ required for inquiries & rules
  //   };

  //   return this.addInformation(docID, dataToSave, 'pet-adoption');
  // }

  // async updatePetStatus(docID: string, status: PetStatus) {
  //   if (!docID)
  //     throw new Error('Pet document ID is required to update status.');
  //   const docRef = doc(this.db, 'pet-adoption', docID);
  //   await updateDoc(docRef, { status, updatedAt: serverTimestamp() });
  //   return true;
  // }

  // async updatePet(docID: string, petData: any) {
  //   const user = this.getCurrentUser();
  //   if (!user) throw new Error('User must be signed in to update pets.');
  //   if (!docID) throw new Error('Pet document ID is required to update pet.');

  //   const dataToSave = {
  //     ...petData,
  //     updatedAt: serverTimestamp(),
  //   };

  //   // Use the generic updateInformation method to update the pet document
  //   await this.updateInformation('pet-adoption', docID, dataToSave);
  //   return true;
  // }

  // async getActivePets() {
  //   return this.getFilteredInformation('pet-adoption', 'status', '==', 'Active');
  // }

  async submitPet(petData: any) {
    const user = this.getCurrentUser();
    if (!user) throw new Error('User must be signed in to submit pets.');

    // Ensure Firestore doc id === saved "id" field
    const docID = `${petData.petName}_${Date.now()}`;

    const dataToSave = {
      ...petData,
      id: docID, // <-- align field with doc id
      status: 'Pending' as PetStatus,
      createdAt: serverTimestamp(),
      submitterUid: user.uid,
    };

    return this.addInformation(docID, dataToSave, 'pet-adoption');
  }

  async updatePetStatus(docID: string, status: PetStatus) {
    if (!docID)
      throw new Error('Pet document ID is required to update status.');
    const docRef = doc(this.db, 'pet-adoption', docID);
    await updateDoc(docRef, { status, updatedAt: serverTimestamp() });
    return true;
  }

  async updatePet(docID: string, petData: any) {
    const user = this.getCurrentUser();
    if (!user) throw new Error('User must be signed in to update pets.');
    if (!docID) throw new Error('Pet document ID is required to update pet.');

    const dataToSave = {
      ...petData,
      updatedAt: serverTimestamp(),
    };

    // Use the generic updateInformation method to update the pet document
    await this.updateInformation('pet-adoption', docID, dataToSave);
    return true;
  }

  async getActivePets() {
    return this.getFilteredInformation(
      'pet-adoption',
      'status',
      '==',
      'Active'
    );
  }

  async getUserPets(uid: string): Promise<any[]> {
    if (!uid) throw new Error('No user UID provided');
    return this.getFilteredInformation(
      'pet-adoption',
      'submitterUid',
      '==',
      uid
    );
  }
  
  /** Convenience: fetch a single pet by id (used by details page) */
  async getPetById(id: string) {
    return this.getDocument('pet-adoption', id);
  }

  /** Optional alias if some pages call it this name already */
  async getAdoptionById(id: string) {
    return this.getPetById(id);
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

    const favRef = doc(
      this.db,
      this.favoriteCol(collectionName),
      this.favoriteDocId(user.uid, petId)
    );

    if (value) {
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
        updatedAt: serverTimestamp(),
      });
    } else {
      await deleteDoc(favRef);
    }
  }

  async isFavorite(collectionName: string, petId: string): Promise<boolean> {
    const user = this.getCurrentUser();
    if (!user) return false;
    const favRef = doc(
      this.db,
      this.favoriteCol(collectionName),
      this.favoriteDocId(user.uid, petId)
    );
    const snap = await getDoc(favRef);
    return snap.exists();
  }

  async toggleFavorite(collectionName: string, pet: any): Promise<boolean> {
    const isFav = await this.isFavorite(collectionName, pet.id);
    await this.setFavorite(collectionName, pet, !isFav);
    return !isFav;
  }

  // Replace the setDirectoryFavorite and getDirectoryFavorites methods in firebase.service.ts
  async setDirectoryFavorite(
    collectionName: string,
    item: any | string,
    value: boolean
  ) {
    const user = this.getCurrentUser();
    if (!user) throw new Error('User must be signed in to manage favorites.');

    let id: string;
    let data: any;

    if (typeof item === 'string') {
      id = item;
      const originalData = await this.getDocument(collectionName, id);
      if (!originalData)
        throw new Error(`Item not found in ${collectionName} collection.`);
      data = originalData;
    } else {
      id = item.id;
      data = item;
    }

    const favRef = doc(
      this.db,
      `${collectionName}_favorites`,
      `${user.uid}_${id}`
    );

    if (value) {
      // Save all fields from the original ABC record "as is"
      const favoriteData = {
        ...data, // Preserve all original fields
        id,
        type: collectionName, // Maps to 'abc', 'ambulance', etc., for FavType
        name: data.name || data.type || 'Untitled',
        userId: user.uid,
        addedAt: serverTimestamp(),
      };
      await setDoc(favRef, favoriteData);
      console.log(
        `Saved favorite to ${collectionName}_favorites/${user.uid}_${id}:`,
        favoriteData
      ); // Debug log
    } else {
      await deleteDoc(favRef);
      console.log(
        `Removed favorite from ${collectionName}_favorites/${user.uid}_${id}`
      ); // Debug log
    }
  }

  async getDirectoryFavorites(collectionName: string): Promise<any[]> {
    const user = this.getCurrentUser();
    if (!user) {
      console.log(`No user signed in for fetching ${collectionName}_favorites`);
      return [];
    }

    try {
      const favSnapshot = await getDocs(
        query(
          collection(this.db, `${collectionName}_favorites`),
          where('userId', '==', user.uid)
        )
      );
      const favorites = favSnapshot.docs.map((d) => {
        const data: any = d.data();
        return {
          ...data, // Preserve all original fields
          id: d.id.split('_')[1],
          type: collectionName, // Maps to 'abc', 'ambulance', etc., for FavType
          name: data.name || data.type || 'Untitled',
          image:
            data.image ||
            (Array.isArray(data.photos) && data.photos.length > 0
              ? data.photos[0]
              : 'assets/default-thumb.png'),
          favorite: true,
          dateAdded: data.addedAt?.toMillis() || Date.now(),
        };
      });
      console.log(`Fetched ${collectionName}_favorites:`, favorites); // Debug log
      return favorites;
    } catch (error) {
      console.error(`Error fetching ${collectionName}_favorites:`, error);
      return [];
    }
  }

  async getFavoriteIds(collectionName: string): Promise<Set<string>> {
    const user = this.getCurrentUser();
    if (!user) return new Set();

    const favSnapshot = await getDocs(
      query(
        collection(this.db, this.favoriteCol(collectionName)),
        where('userId', '==', user.uid)
      )
    );

    const ids = favSnapshot.docs.map((d) => d.id.split('_')[1]);
    return new Set(ids);
  }

  async getFavoritePets(collectionName: string): Promise<any[]> {
    const user = this.getCurrentUser();
    if (!user) return [];

    const favSnapshot = await getDocs(
      query(
        collection(this.db, this.favoriteCol(collectionName)),
        where('userId', '==', user.uid)
      )
    );

    return favSnapshot.docs.map((d) => {
      const petId = d.id.split('_')[1];
      const data: any = d.data();

      const image =
        Array.isArray(data.photos) && data.photos.length > 0
          ? data.photos[0]
          : data.image || 'assets/default-pet.jpg';

      return {
        id: petId,
        petName: data.petName || 'Unknown',
        breed: data.breed || 'Unknown',
        age: data.age ?? 0,
        gender: data.gender || '',
        image,
        category: data.category || data.species || 'Unknown',
        favorite: true,
        contact: data.contact || '',
        location: data.location || 'Not available',
        remarks: data.remarks || '',
        timings: data.timings || 'Not available',
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
      createdAt: new Date(),
    });
  }

  async getReports() {
    const colRef = collection(this.db, 'reports');
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  // ---------------- Adoption Inquiries (COMPLETE) ----------------

  /**
   * Create (or reuse) a unique inquiry per (adoptionId, fromUid). Also writes the first message.
   * Returns the inquiryId.
   */
  async addAdoptionInquiry(input: {
    adoptionId: string;
    message: string;
    fromName?: string;
    fromPhone?: string;
  }): Promise<string> {
    const user = this.getCurrentUser();
    if (!user) throw new Error('Please sign in to send an inquiry.');

    const adoptionId = input.adoptionId;
    const firstMsg = (input.message || '').trim();
    if (!adoptionId || !firstMsg)
      throw new Error('adoptionId and message are required.');

    // Lookup listing to find owner info and denormalize preview fields
    const pet: any = await this.getDocument('pet-adoption', adoptionId);
    if (!pet) throw new Error('Adoption post not found.');

    const ownerUid: string | undefined = pet.ownerUid || pet.submitterUid;
    if (!ownerUid) {
      // require owner to satisfy rules and visibility
      throw new Error(
        'Owner info missing on listing. Please ask the owner to update the post.'
      );
    }
    if (ownerUid === user.uid) {
      throw new Error('You cannot inquire on your own listing.');
    }

    // One inquiry per user per listing
    const inquiryId = `${adoptionId}_${user.uid}`;
    const inqRef = doc(this.db, 'adoptionInquiries', inquiryId);
    const existing = await getDoc(inqRef);

    // Denormalized preview for inbox cards
    const photos = Array.isArray(pet.photos) ? pet.photos : [];
    const cover = photos.length ? photos[0] : pet.image || null;

    if (!existing.exists()) {
      await setDoc(inqRef, {
        adoptionId,
        ownerUid, // ✅ ensure present for rules & filters
        fromUid: user.uid,
        status: 'open',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessage: firstMsg, // ✅ required by rules on create
        lastMessageAt: serverTimestamp(),

        // optional inquirer fields
        fromName: input.fromName || user.displayName || '',
        fromPhone: input.fromPhone || user.phoneNumber || '',

        // denormalized pet preview
        petName: pet.petName || '',
        species: pet.species || '',
        city: pet.location || '',
        cover: cover || null,
      });
    } else {
      // keep it open and bump last message
      await updateDoc(inqRef, {
        status: 'open',
        updatedAt: serverTimestamp(),
        lastMessage: firstMsg,
        lastMessageAt: serverTimestamp(),
      });
    }

    // Append first message in the subcollection
    const msgsCol = collection(
      this.db,
      `adoptionInquiries/${inquiryId}/messages`
    );
    await addDoc(msgsCol, {
      senderUid: user.uid,
      message: firstMsg,
      createdAt: serverTimestamp(),
    });

    return inquiryId;
  }

  /** Send a reply into an inquiry thread and update the envelope lastMessage */
  async addInquiryReply(inquiryId: string, message: string) {
    const user = this.getCurrentUser();
    if (!user) throw new Error('Sign in required');
    const msg = (message || '').trim();
    if (!inquiryId || !msg) throw new Error('Missing inquiryId/message');

    // Write message
    const msgsCol = collection(
      this.db,
      `adoptionInquiries/${inquiryId}/messages`
    );
    await addDoc(msgsCol, {
      senderUid: user.uid,
      message: msg,
      createdAt: serverTimestamp(),
    });

    // Update envelope
    await updateDoc(doc(this.db, 'adoptionInquiries', inquiryId), {
      lastMessage: msg,
      lastMessageAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  /** Change inquiry status (both participants can close) */
  async setInquiryStatus(
    inquiryId: string,
    status: 'open' | 'closed' | 'pending'
  ) {
    const user = this.getCurrentUser();
    if (!user) throw new Error('Sign in required');
    await updateDoc(doc(this.db, 'adoptionInquiries', inquiryId), {
      status,
      updatedAt: serverTimestamp(),
    });
  }

  /** Realtime Inbox – Received (for listing owner) */
  listenInquiriesReceived(
    onUpdate: (rows: any[]) => void,
    onError: (e: any) => void
  ): Unsubscribe {
    const user = this.getCurrentUser();
    if (!user) throw new Error('Sign in required');
    const qy = query(
      collection(this.db, 'adoptionInquiries'),
      where('ownerUid', '==', user.uid),
      orderBy('lastMessageAt', 'desc'),
      limit(100)
    );
    return onSnapshot(
      qy,
      (snap) => {
        onUpdate(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      onError
    );
  }

  /** Realtime Inbox – Sent (for inquirer) */
  listenInquiriesSent(
    onUpdate: (rows: any[]) => void,
    onError: (e: any) => void
  ): Unsubscribe {
    const user = this.getCurrentUser();
    if (!user) throw new Error('Sign in required');
    const qy = query(
      collection(this.db, 'adoptionInquiries'),
      where('fromUid', '==', user.uid),
      orderBy('lastMessageAt', 'desc'),
      limit(100)
    );
    return onSnapshot(
      qy,
      (snap) => {
        onUpdate(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      onError
    );
  }

  /** Realtime messages in a thread */
  listenInquiryMessages(
    inquiryId: string,
    onUpdate: (msgs: any[]) => void,
    onError: (e: any) => void
  ): Unsubscribe {
    const qy = query(
      collection(this.db, `adoptionInquiries/${inquiryId}/messages`),
      orderBy('createdAt', 'asc'),
      limit(500)
    );
    return onSnapshot(
      qy,
      (snap) => {
        onUpdate(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      onError
    );
  }

  /** Non-realtime list (owner inbox) */
  async listMyInquiriesReceived(): Promise<any[]> {
    const user = this.getCurrentUser();
    if (!user) throw new Error('Sign in required');
    const snap = await getDocs(
      query(
        collection(this.db, 'adoptionInquiries'),
        where('ownerUid', '==', user.uid),
        orderBy('lastMessageAt', 'desc'),
        limit(100)
      )
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  /** Non-realtime list (sent by me) */
  async listMyInquiriesSent(): Promise<any[]> {
    const user = this.getCurrentUser();
    if (!user) throw new Error('Sign in required');
    const snap = await getDocs(
      query(
        collection(this.db, 'adoptionInquiries'),
        where('fromUid', '==', user.uid),
        orderBy('lastMessageAt', 'desc'),
        limit(100)
      )
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  // ---------------- Push token helper (optional, for Cloud Functions) ---------------
  async saveFcmToken(token: string) {
    const user = this.getCurrentUser();
    if (!user || !token) return;
    const uref = doc(this.db, 'users', user.uid);
    await setDoc(
      uref,
      {
        fcmTokens: arrayUnion(token),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }

  // ---------------- Backfill helpers (optional) ----------------
  /** One-off: ensure a single pet has ownerUid (copied from submitterUid) */
  async ensureOwnerUidOnPet(petId: string): Promise<boolean> {
    const ref = doc(this.db, 'pet-adoption', petId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return false;
    const data: any = snap.data();
    if (!data.ownerUid && data.submitterUid) {
      await updateDoc(ref, {
        ownerUid: data.submitterUid,
        updatedAt: serverTimestamp(),
      });
      return true;
    }
    return false;
  }

  /** One-off: backfill all my listings missing ownerUid */
  async backfillOwnerUidForMyListings(): Promise<number> {
    const user = this.getCurrentUser();
    if (!user) throw new Error('Sign in required');
    const qy = query(
      collection(this.db, 'pet-adoption'),
      where('submitterUid', '==', user.uid)
    );
    const snap = await getDocs(qy);
    let fixed = 0;
    await Promise.all(
      snap.docs.map(async (d) => {
        const data: any = d.data();
        if (!data.ownerUid && data.submitterUid) {
          await updateDoc(d.ref, {
            ownerUid: data.submitterUid,
            updatedAt: serverTimestamp(),
          });
          fixed++;
        }
      })
    );
    return fixed;
  }
}

// import { Injectable } from '@angular/core';
// import { initializeApp } from 'firebase/app';
// import {
//   getFirestore,
//   collection,
//   doc,
//   setDoc,
//   getDocs,
//   updateDoc,
//   getDoc,
//   addDoc,
//   query,
//   where,
//   deleteDoc,
//   limit,
//   orderBy,
//   startAfter,
//   serverTimestamp,
//   WhereFilterOp,
//   onSnapshot,
//   Unsubscribe,
// } from 'firebase/firestore';
// import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { environment } from '../../environments/environment';
// import {
//   getAuth,
//   sendPasswordResetEmail,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   signOut,
//   User,
// } from 'firebase/auth';

// export type PetStatus = 'Pending' | 'Active' | 'Adopted' | 'Inactive';

// @Injectable({
//   providedIn: 'root',
// })
// export class FirebaseService {
//   private app = initializeApp(environment.firebaseConfig);
//   private db = getFirestore(this.app);
//   private storage = getStorage(this.app);
//   private auth = getAuth(this.app);

//   constructor() {}

//   // ---------------- Auth Methods ----------------
//   async signIn(email: string, password: string) {
//     if (!email || !password)
//       throw new Error('Email and password are required.');
//     const result = await signInWithEmailAndPassword(this.auth, email, password);
//     return result.user;
//   }

//   async signUp(email: string, password: string) {
//     if (!email || !password)
//       throw new Error('Email and password are required.');
//     const result = await createUserWithEmailAndPassword(
//       this.auth,
//       email,
//       password
//     );
//     return result.user;
//   }

//   async signOutUser() {
//     await signOut(this.auth);
//   }

//   getCurrentUser(): User | null {
//     return this.auth.currentUser;
//   }

//   async resetPasswordWithEmail(email: string) {
//     await sendPasswordResetEmail(this.auth, email, {
//       url: 'http://localhost:4200/signin',
//       handleCodeInApp: true,
//     });
//   }

//   // ---------------- Real-Time Listener ----------------
//   listenToCollection(
//     collectionName: string,
//     onUpdate: (data: any[]) => void,
//     onError: (error: any) => void
//   ): Unsubscribe {
//     const colRef = collection(this.db, collectionName);
//     return onSnapshot(
//       colRef,
//       (snapshot) => {
//         const data = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         onUpdate(data);
//       },
//       onError
//     );
//   }

//   // ---------------- Firestore Generic Methods ----------------
//   async addInformation(docID: string, data: any, collectionName: string) {
//     const colRef = collection(this.db, collectionName);
//     const docRef = doc(colRef, docID);
//     await setDoc(docRef, data);
//     return docRef.id;
//   }

//   async updateInformation(collectionName: string, docID: string, data: any) {
//     const docRef = doc(this.db, collectionName, docID);
//     await updateDoc(docRef, data);
//   }

//   async deleteInformation(collectionName: string, docID: string) {
//     const docRef = doc(this.db, collectionName, docID);
//     await deleteDoc(docRef);
//   }

//   async getInformation(collectionName: string) {
//     const colRef = collection(this.db, collectionName);
//     const snapshot = await getDocs(colRef);
//     return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
//   }

//   async getFilteredInformation(
//     collectionName: string,
//     field: string,
//     operator: WhereFilterOp,
//     value: any
//   ) {
//     const colRef = collection(this.db, collectionName);
//     const q = query(colRef, where(field, operator, value));
//     const snapshot = await getDocs(q);
//     return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
//   }

//   async getPaginatedInformation(
//     collectionName: string,
//     pageSize: number,
//     lastDoc: any = null
//   ) {
//     const colRef = collection(this.db, collectionName);
//     let q = query(colRef, orderBy('createdAt', 'desc'), limit(pageSize));
//     if (lastDoc)
//       q = query(
//         colRef,
//         orderBy('createdAt', 'desc'),
//         startAfter(lastDoc),
//         limit(pageSize)
//       );
//     const snapshot = await getDocs(q);
//     return {
//       data: snapshot.docs.map((d) => ({ id: d.id, ...d.data() })),
//       lastDoc: snapshot.docs[snapshot.docs.length - 1],
//     };
//   }

//   async getDocument(collectionName: string, id: string) {
//     const docRef = doc(this.db, collectionName, id);
//     const docSnap = await getDoc(docRef);
//     return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
//   }

//   // ---------------- Pet Methods ----------------
//   async submitPet(petData: any) {
//     const user = this.getCurrentUser();
//     if (!user) throw new Error('User must be signed in to submit pets.');

//     // Ensure Firestore doc id === saved "id" field
//     const docID = `${petData.petName}_${Date.now()}`;

//     const dataToSave = {
//       ...petData,
//       id: docID, // <-- align field with doc id
//       status: 'Pending' as PetStatus,
//       createdAt: serverTimestamp(),
//       submitterUid: user.uid,
//     };

//     return this.addInformation(docID, dataToSave, 'pet-adoption');
//   }

//   async updatePetStatus(docID: string, status: PetStatus) {
//     if (!docID)
//       throw new Error('Pet document ID is required to update status.');
//     const docRef = doc(this.db, 'pet-adoption', docID);
//     await updateDoc(docRef, { status, updatedAt: serverTimestamp() });
//     return true;
//   }

//   async updatePet(docID: string, petData: any) {
//     const user = this.getCurrentUser();
//     if (!user) throw new Error('User must be signed in to update pets.');
//     if (!docID) throw new Error('Pet document ID is required to update pet.');

//     const dataToSave = {
//       ...petData,
//       updatedAt: serverTimestamp(),
//     };

//     // Use the generic updateInformation method to update the pet document
//     await this.updateInformation('pet-adoption', docID, dataToSave);
//     return true;
//   }

//   async getActivePets() {
//     return this.getFilteredInformation(
//       'pet-adoption',
//       'status',
//       '==',
//       'Active'
//     );
//   }

//   async getUserPets(uid: string): Promise<any[]> {
//     if (!uid) throw new Error('No user UID provided');
//     return this.getFilteredInformation(
//       'pet-adoption',
//       'submitterUid',
//       '==',
//       uid
//     );
//   }

//   // ---------------- Storage Methods ----------------
//   async uploadFile(file: File, path: string): Promise<string> {
//     const storageRef = ref(this.storage, path);
//     await uploadBytes(storageRef, file);
//     const downloadURL = await getDownloadURL(storageRef);
//     return downloadURL;
//   }

//   // ---------------- Favorites ----------------
//   private favoriteCol(collectionName: string) {
//     return `${collectionName}_favorites`;
//   }

//   private favoriteDocId(userUid: string, petId: string) {
//     return `${userUid}_${petId}`;
//   }

//   /**
//    * Save/remove favorite for current user.
//    * - Accepts either pet id (string) or full pet object
//    * - Writes minimal safe fields needed for list rendering
//    */
//   async setFavorite(collectionName: string, pet: any | string, value: boolean) {
//     const user = this.getCurrentUser();
//     if (!user) throw new Error('User must be signed in to manage favorites.');

//     let petId: string;
//     let petData: any;

//     if (typeof pet === 'string') {
//       petId = pet;
//       const originalPet = await this.getDocument(collectionName, petId);
//       if (!originalPet) throw new Error('Pet not found.');
//       petData = originalPet;
//     } else {
//       petId = pet.id;
//       petData = pet;
//     }

//     const favRef = doc(
//       this.db,
//       this.favoriteCol(collectionName),
//       this.favoriteDocId(user.uid, petId)
//     );

//     if (value) {
//       // only persist necessary denormalized fields to render favorites quickly
//       await setDoc(favRef, {
//         id: petId,
//         petName: petData.petName ?? '',
//         species: petData.species ?? petData.category ?? '',
//         category: petData.category ?? petData.species ?? '',
//         photos: Array.isArray(petData.photos) ? petData.photos : [],
//         image: petData.image ?? null,
//         breed: petData.breed ?? '',
//         age: petData.age ?? null,
//         gender: petData.gender ?? '',
//         contact: petData.contact ?? '',
//         location: petData.location ?? '',
//         remarks: petData.remarks ?? '',
//         timings: petData.timings ?? '',
//         favorite: true,
//         userId: user.uid,
//         updatedAt: serverTimestamp(),
//       });
//     } else {
//       await deleteDoc(favRef);
//     }
//   }

//   async isFavorite(collectionName: string, petId: string): Promise<boolean> {
//     const user = this.getCurrentUser();
//     if (!user) return false;
//     const favRef = doc(
//       this.db,
//       this.favoriteCol(collectionName),
//       this.favoriteDocId(user.uid, petId)
//     );
//     const snap = await getDoc(favRef);
//     return snap.exists();
//   }

//   async toggleFavorite(collectionName: string, pet: any): Promise<boolean> {
//     const isFav = await this.isFavorite(collectionName, pet.id);
//     await this.setFavorite(collectionName, pet, !isFav);
//     return !isFav;
//   }

//   // Replace the setDirectoryFavorite and getDirectoryFavorites methods in firebase.service.ts
//   async setDirectoryFavorite(
//     collectionName: string,
//     item: any | string,
//     value: boolean
//   ) {
//     const user = this.getCurrentUser();
//     if (!user) throw new Error('User must be signed in to manage favorites.');

//     let id: string;
//     let data: any;

//     if (typeof item === 'string') {
//       id = item;
//       const originalData = await this.getDocument(collectionName, id);
//       if (!originalData)
//         throw new Error(`Item not found in ${collectionName} collection.`);
//       data = originalData;
//     } else {
//       id = item.id;
//       data = item;
//     }

//     const favRef = doc(
//       this.db,
//       `${collectionName}_favorites`,
//       `${user.uid}_${id}`
//     );

//     if (value) {
//       // Save all fields from the original ABC record "as is"
//       const favoriteData = {
//         ...data, // Preserve all original fields
//         id,
//         type: collectionName, // Maps to 'abc', 'ambulance', etc., for FavType
//         name: data.name || data.type || 'Untitled',
//         userId: user.uid,
//         addedAt: serverTimestamp(),
//       };
//       await setDoc(favRef, favoriteData);
//       console.log(
//         `Saved favorite to ${collectionName}_favorites/${user.uid}_${id}:`,
//         favoriteData
//       ); // Debug log
//     } else {
//       await deleteDoc(favRef);
//       console.log(
//         `Removed favorite from ${collectionName}_favorites/${user.uid}_${id}`
//       ); // Debug log
//     }
//   }

//   async getDirectoryFavorites(collectionName: string): Promise<any[]> {
//     const user = this.getCurrentUser();
//     if (!user) {
//       console.log(`No user signed in for fetching ${collectionName}_favorites`);
//       return [];
//     }

//     try {
//       const favSnapshot = await getDocs(
//         query(
//           collection(this.db, `${collectionName}_favorites`),
//           where('userId', '==', user.uid)
//         )
//       );
//       const favorites = favSnapshot.docs.map((d) => {
//         const data: any = d.data();
//         return {
//           ...data, // Preserve all original fields
//           id: d.id.split('_')[1],
//           type: collectionName, // Maps to 'abc', 'ambulance', etc., for FavType
//           name: data.name || data.type || 'Untitled',
//           image:
//             data.image ||
//             (Array.isArray(data.photos) && data.photos.length > 0
//               ? data.photos[0]
//               : 'assets/default-thumb.png'),
//           favorite: true,
//           dateAdded: data.addedAt?.toMillis() || Date.now(),
//         };
//       });
//       console.log(`Fetched ${collectionName}_favorites:`, favorites); // Debug log
//       return favorites;
//     } catch (error) {
//       console.error(`Error fetching ${collectionName}_favorites:`, error);
//       return [];
//     }
//   }

//   /**
//    * Fast helper to pre-mark heart icons on listing pages.
//    * Returns Set of petIds that are favorited by current user.
//    */
//   async getFavoriteIds(collectionName: string): Promise<Set<string>> {
//     const user = this.getCurrentUser();
//     if (!user) return new Set();

//     const favSnapshot = await getDocs(
//       query(
//         collection(this.db, this.favoriteCol(collectionName)),
//         where('userId', '==', user.uid)
//       )
//     );

//     const ids = favSnapshot.docs.map((d) => d.id.split('_')[1]);
//     return new Set(ids);
//   }

//   /**
//    * Get denormalized favorite pet cards to show in Favorites screen.
//    */
//   async getFavoritePets(collectionName: string): Promise<any[]> {
//     const user = this.getCurrentUser();
//     if (!user) return [];

//     const favSnapshot = await getDocs(
//       query(
//         collection(this.db, this.favoriteCol(collectionName)),
//         where('userId', '==', user.uid)
//       )
//     );

//     return favSnapshot.docs.map((d) => {
//       const petId = d.id.split('_')[1];
//       const data: any = d.data();

//       const image =
//         Array.isArray(data.photos) && data.photos.length > 0
//           ? data.photos[0]
//           : data.image || 'assets/default-pet.jpg';

//       return {
//         id: petId,
//         petName: data.petName || 'Unknown',
//         breed: data.breed || 'Unknown',
//         age: data.age ?? 0,
//         gender: data.gender || '',
//         image,
//         // normalize category/species for UI
//         category: data.category || data.species || 'Unknown',
//         favorite: true,
//         contact: data.contact || '',
//         location: data.location || 'Not available',
//         remarks: data.remarks || '',
//         timings: data.timings || 'Not available',
//       };
//     });
//   }

//   // ---------------- Reports ----------------
//   async reportEntry(collectionName: string, id: string, reason: string) {
//     const user = this.getCurrentUser();
//     if (!user) throw new Error('User must be signed in to report entries.');
//     const reportsRef = collection(this.db, 'reports');
//     await addDoc(reportsRef, {
//       collection: collectionName,
//       id,
//       reason,
//       userId: user.uid,
//       createdAt: new Date(),
//     });
//   }

//   async getReports() {
//     const colRef = collection(this.db, 'reports');
//     const snapshot = await getDocs(colRef);
//     return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
//   }
// }
