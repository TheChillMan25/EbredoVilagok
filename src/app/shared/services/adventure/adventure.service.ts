import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { Adventure, User } from '../../models/models';
import { firstValueFrom, map, Observable, switchMap, take } from 'rxjs';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
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

      const adventureCollection = collection(this.firestore, 'Adventures');
      const docRef = await addDoc(adventureCollection, adventure);
      const advID = docRef.id;

      await updateDoc(docRef, { id: advID });
      const newAdventure: Adventure = {
        ...adventure,
        id: advID,
      } as Adventure;

      const userDocRef = doc(this.firestore, 'Users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        const adventures = userData.adventures || [];
        adventures.push(advID);
        await updateDoc(userDocRef, { adventures });
      }
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
            where('id', 'in', userData.adventures)
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
