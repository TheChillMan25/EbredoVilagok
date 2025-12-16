import { Injectable } from '@angular/core';
import {
  collectionData,
  doc,
  Firestore,
  getDoc,
} from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import {
  catchError,
  combineLatest,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { ForumPost, User } from '../../models/models';
import { collection } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class ForumService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  getAllPosts(): Observable<{ charPosts: ForumPost[]; advPosts: ForumPost[] }> {
    const charPostCollection = collection(this.firestore, 'CharacterPosts');
    const advPostCollection = collection(this.firestore, 'AdventurePosts');

    const charPosts$ = collectionData(charPostCollection, {
      idField: 'id',
    }) as Observable<ForumPost[]>;

    const advPosts$ = collectionData(advPostCollection, {
      idField: 'id',
    }) as Observable<ForumPost[]>;

    return combineLatest({
      charPosts: charPosts$,
      advPosts: advPosts$,
    }).pipe(
      catchError((error) => {
        console.error('Hiba a postok lekérésekor: ', error);
        return of({ charPosts: [], advPosts: [] });
      })
    );
  }
}
