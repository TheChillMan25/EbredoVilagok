import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  authState,
  User as FirebaseUser,
  UserCredential,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth';
import {
  doc,
  Firestore,
  setDoc,
  collection,
  getDocs,
  query,
  where,
  getDoc,
} from '@angular/fire/firestore';
import { User } from '../../models/models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser: Observable<FirebaseUser | null>;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    this.currentUser = authState(this.auth);
  }

  signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  signOut(): Promise<void> {
    localStorage.setItem('isLoggedIn', 'false');
    return signOut(this.auth).then(() => {
      this.router.navigateByUrl('/index');
    });
  }

  async register(
    email: string,
    password: string,
    username: string
  ): Promise<UserCredential> {
    try {
      const taken = await this.isUsernameTaken(username);
      if (taken) {
        throw new Error('A felhasználónév már foglalt!', {
          cause: 'TakenUsername',
        });
      }

      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      const userId = userCredential.user.uid;

      try {
        const usernameRef = doc(this.firestore, 'Usernames', username);
        if ((await getDoc(usernameRef)).exists()) {
          throw new Error('A felhasználónév már foglalt!', {
            cause: 'TakenUsername',
          });
        }
        await setDoc(usernameRef, { taken: true });

        await this.createUserData(userCredential.user.uid, {
          id: userCredential.user.uid,
          username: username,
          email: email,
          characters: [],
          adventures: [],
          games: [],
          inGame: false,
        } as User);
      } catch (error) {
        await userCredential.user.delete();
        throw error;
      }
      return userCredential;
    } catch (error) {
      console.error('Hiba a regisztráció során:', error);
      throw error;
    }
  }

  private async isUsernameTaken(username: string): Promise<boolean> {
    const usernameRef = doc(this.firestore, 'Usernames', username);
    const docSnap = await getDoc(usernameRef);
    return docSnap.exists();
  }

  private async createUserData(
    userId: string,
    userData: Partial<User>
  ): Promise<void> {
    const userRef = doc(collection(this.firestore, 'Users'), userId);

    return setDoc(userRef, userData);
  }

  isLoggedIn(): Observable<FirebaseUser | null> {
    return this.currentUser;
  }

  updateLoginStatus(isLoggedIn: boolean): void {
    localStorage.setItem('isLoggedIn', isLoggedIn ? 'true' : 'false');
  }
}
