import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { Adventure, User } from '../../models/models';
import { firstValueFrom, take } from 'rxjs';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';

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
}
