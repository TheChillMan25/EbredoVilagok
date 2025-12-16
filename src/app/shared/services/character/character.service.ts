import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { Character, User } from '../../models/models';
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
export class CharacterService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  async addCharacter(character: Omit<Character, 'id'>): Promise<Character> {
    try {
      const user = await firstValueFrom(
        this.authService.currentUser.pipe(take(1))
      );
      if (!user) throw new Error('Felhasználó nem található!');

      const characterCollection = collection(this.firestore, 'Characters');
      const docRef = await addDoc(characterCollection, character);
      const charID = docRef.id;

      await updateDoc(docRef, { id: charID });
      const newCharacter: Character = {
        ...character,
        id: charID,
      } as Character;

      const userDocRef = doc(this.firestore, 'Users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        const characters = userData.characters || [];
        characters.push(charID);
        await updateDoc(userDocRef, { characters });
      }

      return newCharacter;
    } catch (error) {
      console.error('Error adding character:', error);
      throw error;
    }
  }

  getAllCharacters(): Observable<Character[]> {
    return this.authService.currentUser.pipe(
      switchMap(async (user) => {
        if (!user) return [];
        try {
          const userDocRef = doc(this.firestore, 'Users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) return [];

          const userData = userDoc.data() as User;
          const charIDs = userData.characters || [];

          if (charIDs.length === 0) return [];

          const characterCollection = collection(this.firestore, 'Characters');
          const characters: Character[] = [];

          const q = query(
            characterCollection,
            where('id', 'in', userData.characters)
          );
          const snapShot = await getDocs(q);
          snapShot.forEach((doc) => {
            characters.push({ ...doc.data(), id: doc.id } as Character);
          });

          return characters;
        } catch (error) {
          console.error('Error fetching characters:', error);
          return [];
        }
      }),
      map((characters) => characters as Character[])
    );
  }

  async getCharacterByID(charID: string): Promise<Character | null> {
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
      if (!userData.characters || !userData.characters.includes(charID)) {
        return null;
      }

      const charDocRef = doc(this.firestore, 'Characters', charID);
      const charSnapShot = await getDoc(charDocRef);
      if (charSnapShot.exists()) {
        return { ...charSnapShot.data(), id: charID } as Character;
      }

      console.error('Karakter nem található!');
      return null;
    } catch (error) {
      console.error('Hiba a karakter lekérdezésekor: ', error);
      return null;
    }
  }

  async deleteCharacter(charId: string): Promise<void> {
    try {
      const user = await firstValueFrom(
        this.authService.currentUser.pipe(take(1))
      );

      if (!user) throw new Error('Nem található felhasználó!');

      const userDocRef = doc(this.firestore, 'Users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) throw new Error('A felhasználó nem létezik!');

      const userData = userDoc.data() as User;
      if (!userData.characters || !userData.characters.includes(charId))
        throw new Error('Nem társítható karakter a felhasználóhoz');

      const charDocRef = doc(this.firestore, 'Characters', charId);
      await deleteDoc(charDocRef);

      const updatedCharacters = userData.characters.filter(
        (id) => id !== charId
      );
      return updateDoc(userDocRef, { characters: updatedCharacters });
    } catch (error) {
      console.error('Hiba a karakter törlésekor: ', error);
      throw error;
    }
  }
}
