import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { Adventure, User } from '../../models/models';
import { firstValueFrom, map, Observable, switchMap, take } from 'rxjs';
import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class AdventureService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  async addAdventure(adventure: Omit<Adventure, 'id'>): Promise<Adventure> {
    try {
      const user = await firstValueFrom(
        this.authService.currentUser.pipe(take(1))
      );
      if (!user) throw new Error('Felhasználó nem található!');

      const userDocRef = doc(this.firestore, 'Users', user.uid);
      const userSnap = await getDoc(userDocRef);
      if (!userSnap.exists()) throw new Error('Felhasználó nem található!');
      const userData = userSnap.data() as User;
      if (userData.adventures.length === 10) {
        throw new Error('Maximum kalandszám elérve, nem készíthető több!');
      }

      const adventuresColRef = collection(this.firestore, 'Adventures');
      const adventureDocRef = doc(adventuresColRef); // előre generált ID

      const newAdventure: Adventure = {
        ...adventure,
        id: adventureDocRef.id,
      };

      const batch = writeBatch(this.firestore);
      batch.set(adventureDocRef, newAdventure);
      batch.update(userDocRef, {
        adventures: arrayUnion(adventureDocRef.id),
      });

      await batch.commit();

      return newAdventure;
    } catch (error) {
      console.error('Error adding adventure: ', error);
      throw error;
    }
  }

  getAllAdventures(): Observable<Adventure[]> {
    return this.authService.currentUser.pipe(
      switchMap(async (user) => {
        if (!user) return [];
        try {
          const userDocRef = doc(this.firestore, 'Users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) return [];

          const userData = userDoc.data() as User;
          const advIDs = userData.adventures || [];

          if (advIDs.length === 0) return [];

          const adventureCollection = collection(this.firestore, 'Adventures');
          const adventures: Adventure[] = [];

          const q = query(
            adventureCollection,
            where(documentId(), 'in', userData.adventures)
          );
          const snapShot = await getDocs(q);
          snapShot.forEach((doc) => {
            adventures.push({ ...doc.data(), id: doc.id } as Adventure);
          });

          return adventures;
        } catch (error) {
          console.error('Error fetching adventures:', error);
          return [];
        }
      }),
      map((adventures) => adventures as Adventure[])
    );
  }

  async getAdventureByID(advID: string): Promise<Adventure | null> {
    try {
      const user = await firstValueFrom(
        this.authService.currentUser.pipe(take(1))
      );
      if (!user) {
        return null;
      }
      const userDocRef = doc(this.firestore, 'Users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        return null;
      }
      const userData = userDoc.data() as User;
      if (!userData.adventures || !userData.adventures.includes(advID)) {
        return null;
      }

      const advDocRef = doc(this.firestore, 'Adventures', advID);
      const advSnapShot = await getDoc(advDocRef);
      if (advSnapShot.exists()) {
        return { ...advSnapShot.data(), id: advID } as Adventure;
      }

      console.error('Karakter nem található!');
      return null;
    } catch (error) {
      console.error('Hiba a karakter lekérdezésekor: ', error);
      return null;
    }
  }

  async getPublicAdventureByID(advID: string): Promise<Adventure | null> {
    try {
      const advDocRef = doc(this.firestore, 'Adventures', advID);
      const advSnapShot = await getDoc(advDocRef);

      if (advSnapShot.exists()) {
        return { ...advSnapShot.data(), id: advID } as Adventure;
      }
      return null;
    } catch (error) {
      console.error('Hiba a publikus kaland lekérésekor: ', error);
      return null;
    }
  }

  async deleteAdventure(advId: string): Promise<void> {
    try {
      const user = await firstValueFrom(
        this.authService.currentUser.pipe(take(1))
      );

      if (!user) throw new Error('Nem található felhasználó!');

      const userDocRef = doc(this.firestore, 'Users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) throw new Error('A felhasználó nem létezik!');

      const userData = userDoc.data() as User;
      if (!userData.adventures || !userData.adventures.includes(advId))
        throw new Error('Nem társítható karakter a felhasználóhoz');

      const advDocRef = doc(this.firestore, 'Adventures', advId);
      await deleteDoc(advDocRef);

      const updatedAdventures = userData.adventures.filter(
        (id) => id !== advId
      );
      return updateDoc(userDocRef, { adventures: updatedAdventures });
    } catch (error) {
      console.error('Hiba a kaland törlésekor: ', error);
      throw error;
    }
  }
}
