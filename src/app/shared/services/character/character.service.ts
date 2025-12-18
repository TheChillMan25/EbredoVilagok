import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { Character, User } from '../../models/models';
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
export class CharacterService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  async addCharacter(character: Omit<Character, 'id'>): Promise<Character> {
    try {
      const user = await firstValueFrom(
        this.authService.currentUser.pipe(take(1))
      );
      if (!user) throw new Error('Felhasználó nem található!');

      const userDocRef = doc(this.firestore, 'Users', user.uid);
      const userSnap = await getDoc(userDocRef);
      if (!userSnap.exists()) throw new Error('Felhasználó nem található!');
      const userData = userSnap.data() as User;
      
      if(userData.characters.length === 10){
        throw new Error('Maximum kaland szám elérve, nem készíthető több!')
      }

      const charactersColRef = collection(this.firestore, 'Characters');
      const characterDocRef = doc(charactersColRef);

      const newCharacter: Character = {
        ...character,
        id: characterDocRef.id,
      };

      const batch = writeBatch(this.firestore);
      batch.set(characterDocRef, newCharacter);
      batch.update(userDocRef, {
        characters: arrayUnion(characterDocRef.id),
      });

      await batch.commit();

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
            where(documentId(), 'in', userData.characters)
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

  async getPublicCharacterByID(charID: string): Promise<Character | null> {
    try {
      const charDocRef = doc(this.firestore, 'Characters', charID);
      const charSnapShot = await getDoc(charDocRef);

      if (charSnapShot.exists()) {
        return { ...charSnapShot.data(), id: charID } as Character;
      }
      return null;
    } catch (error) {
      console.error('Hiba a publikus karakter lekérésekor: ', error);
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
