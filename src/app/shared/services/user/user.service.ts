import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { from, Observable, of, switchMap } from 'rxjs';
import {
  Adventure,
  Character,
  ForumPost,
  ForumUser,
  User,
} from '../../models/models';
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

  getForumUserProfile(): Observable<{
    user: ForumUser | null;
    posts: ForumPost[];
  }> {
    return (
      this,
      this.authService.currentUser.pipe(
        switchMap((authUser) => {
          if (!authUser) {
            return of({
              user: null,
              posts: [],
            });
          }
          return from(this.fetchUserWithForumData(authUser.uid));
        })
      )
    );
  }

  private async fetchUserWidthData(userID: string): Promise<{
    user: User | null;
    username: string;
    email: string;
    characters: Character[] | [];
    adventures: Adventure[] | [];
  }> {
    try {
      const userDocRef = doc(this.firestore, 'Users', userID);
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
      const user = { ...userData, id: userID };

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
            currentAdventure: characterData?.['currentAdventure'],
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
            name: adventureData?.['name'] ?? '',
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

  private async fetchUserWithForumData(userID: string): Promise<{
    user: ForumUser | null;
    posts: ForumPost[];
  }> {
    try {
      const userDocRef = doc(this.firestore, 'Users', userID);
      const userSnapshot = await getDoc(userDocRef);

      if (!userSnapshot.exists()) {
        console.warn('Usersnapshot not found!');
        return {
          user: null,
          posts: [],
        };
      }

      const userData = userSnapshot.data() as ForumUser;
      const user = { ...userData, id: userID };

      if (!user.posts || user.posts.length === 0) {
        return {
          user,
          posts: [] as ForumPost[],
        };
      }

      const postCollection = collection(this.firestore, 'ForumPosts');
      const q = query(postCollection, where('id', 'in', user.posts));
      const postsSnapShot = await getDocs(q);

      const posts: ForumPost[] = [];
      postsSnapShot.forEach((doc) => {
        const postData = doc.data();
        const post: ForumPost = {
          id: doc.id,
          title: postData?.['title'] ?? '',
          type: postData?.['type'] ?? '',
          text: postData?.['text'] ?? '',
          attachments: postData?.['attachments'] ?? '',
        };
        posts.push(post);
      });
      return {
        user,
        posts,
      };
    } catch (error) {
      console.error('Hiba a forumfelhasználó betöltésekor: ' + error);
      return {
        user: null,
        posts: [],
      };
    }
  }
}
