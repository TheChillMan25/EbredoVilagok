import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { from, Observable, of, switchMap } from 'rxjs';
import { Adventure, Character, User } from '../../models/models';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  getUserProfile(): Observable<{
    user: User | null;
    username: string;
    email: string;
    characters: Character[] | [];
    adventures: Adventure[] | [];
  }> {
    return (
      this,
      this.authService.currentUser.pipe(
        switchMap((authUser) => {
          if (!authUser) {
            return of({
              user: null,
              username: '',
              email: '',
              characters: [] as Character[],
              adventures: [] as Adventure[],
            });
          }
          return from(this.fetchUserWidthData(authUser.uid));
        })
      )
    );
  }

  private async fetchUserWidthData(userId: string): Promise<{
    user: User | null;
    username: string;
    email: string;
    characters: Character[] | [];
    adventures: Adventure[] | [];
  }> {
    try {
      const userDocRef = doc(this.firestore, 'Users', userId);
      const userSnapshot = await getDoc(userDocRef);

      if (!userSnapshot.exists()) {
        console.warn('Usersnapshot not found!');
        return {
          user: null,
          username: '',
          email: '',
          characters: [],
          adventures: [],
        };
      }

      const userData = userSnapshot.data() as User;
      const user = { ...userData, id: userId };

      const characters: Character[] = [];
      if (user.characters && user.characters.length > 0) {
        const characterCollection = collection(this.firestore, 'Characters');
        const q = query(
          characterCollection,
          where('id', 'in', user.characters)
        );
        const charSnapShot = await getDocs(q);

        charSnapShot.forEach((doc) => {
          const characterData = doc.data();
          const character: Character = {
            id: doc.id,
            userId: characterData?.['userId'] ?? '',
            currentAdventure: characterData?.['currentAdventure'] ?? '',
            name: characterData?.['name'] ?? '',
            species: characterData?.['species'] ?? '',
            class: characterData?.['class'] ?? '',
            level: characterData?.['level'] ?? 1,
            specialProperties: characterData?.['specialProperties'] ?? {},
            stats: characterData?.['stats'] ?? {},
            equipment: characterData?.['equipment'] ?? {},
            virtues: characterData?.['virtues'] ?? {},
            items: characterData?.['items'] ?? {
              food: [],
              specialItems: [],
              otherItems: [],
              weaponItems: [],
            },
            wounds: characterData?.['wounds'] ?? {
              small: 0,
              large: 0,
            },
          };
          characters.push(character);
        });
      }

      const adventures: Adventure[] = [];
      if (user.adventures && user.adventures.length > 0) {
        const adventureCollection = collection(this.firestore, 'Adventures');
        const q_a = query(
          adventureCollection,
          where('id', 'in', user.adventures)
        );
        const advSnapShot = await getDocs(q_a);

        advSnapShot.forEach((doc) => {
          const adventureData = doc.data();
          const adventure: Adventure = {
            id: doc.id,
            userId: adventureData?.['userId'] ?? '',
            name: adventureData?.['name'] ?? '',
            events: adventureData?.['events'] ?? '',
            players: adventureData?.['players'] ?? '',
            currentPlayer: adventureData?.['currentPlayer'] ?? '',
          };
          adventures.push(adventure);
        });
      }

      return {
        user,
        username: user.username ?? '',
        email: user.email ?? '',
        characters,
        adventures,
      };
    } catch (error) {
      console.error('Hiba a felhasználói adatok betöltésekor');
      return {
        user: null,
        username: '',
        email: '',
        characters: [],
        adventures: [],
      };
    }
  }

  deleteUser() {}
}
