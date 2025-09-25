
import { Injectable } from '@angular/core';
import { getFirestore, collection, doc, setDoc, getDocs, getDoc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { getAuth, User } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DirectoryFavoritesService {
  private app = initializeApp(environment.firebaseConfig);
  private db = getFirestore(this.app);
  private auth = getAuth(this.app);

  constructor() {}

  private getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  async setDirectoryFavorite(collectionName: string, item: any | string, value: boolean) {
    const user = this.getCurrentUser();
    if (!user) throw new Error('User must be signed in to manage favorites.');

    let id: string;
    let data: any;

    if (typeof item === 'string') {
      id = item;
      const originalData = await this.getDocument(collectionName, id);
      if (!originalData) throw new Error(`Item not found in ${collectionName} collection.`);
      data = originalData;
    } else {
      id = item.id;
      data = item;
    }

    const favRef = doc(this.db, `${collectionName}_favorites`, `${user.uid}_${id}`);

    if (value) {
      const favoriteData = {
        ...data, // Preserve all original fields
        id,
        type: collectionName, // Maps to 'abc', 'ambulance', etc., for FavType
        name: data.name || data.type || 'Untitled',
        userId: user.uid,
        addedAt: serverTimestamp()
      };
      await setDoc(favRef, favoriteData);
      console.log(`Saved favorite to ${collectionName}_favorites/${user.uid}_${id}:`, favoriteData);
    } else {
      await deleteDoc(favRef);
      console.log(`Removed favorite from ${collectionName}_favorites/${user.uid}_${id}`);
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
        query(collection(this.db, `${collectionName}_favorites`), where('userId', '==', user.uid))
      );
      const favorites = favSnapshot.docs.map(d => {
        const data: any = d.data();
        return {
          ...data, // Preserve all original fields
          id: d.id.split('_')[1],
          type: collectionName,
          name: data.name || data.type || 'Untitled',
          image: data.image || (Array.isArray(data.photos) && data.photos.length > 0 ? data.photos[0] : 'assets/default-thumb.png'),
          favorite: true,
          dateAdded: data.addedAt?.toMillis() || Date.now()
        };
      });
      console.log(`Fetched ${collectionName}_favorites:`, favorites);
      return favorites;
    } catch (error) {
      console.error(`Error fetching ${collectionName}_favorites:`, error);
      return [];
    }
  }

  async isDirectoryFavorite(collectionName: string, itemId: string): Promise<boolean> {
    const user = this.getCurrentUser();
    if (!user) {
      console.log(`No user signed in for checking ${collectionName}_favorites/${itemId} favorite status`);
      return false;
    }
    try {
      const favRef = doc(this.db, `${collectionName}_favorites`, `${user.uid}_${itemId}`);
      const snap = await getDoc(favRef);
      const exists = snap.exists();
      console.log(`Favorite status for ${collectionName}_favorites/${user.uid}_${itemId}:`, exists);
      return exists;
    } catch (error) {
      console.error(`Error checking favorite for ${collectionName}_favorites/${itemId}:`, error);
      return false;
    }
  }

  private async getDocument(collectionName: string, id: string) {
    const docRef = doc(this.db, collectionName, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  }
}