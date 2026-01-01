import { Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import {
  catchError,
  combineLatest,
  firstValueFrom,
  map,
  Observable,
  of,
  switchMap,
  take,
} from 'rxjs';
import {
  ForumPostComment,
  ForumPost,
  ForumTopic,
  User,
} from '../../models/models';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class ForumService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  async addPost(
    postData: Omit<ForumPost, 'id' | 'poster' | 'posterUID' | 'createdAt'>
  ): Promise<ForumPost> {
    const user = await firstValueFrom(
      this.authService.currentUser.pipe(take(1))
    );
    if (!user) throw new Error('Felhasználó nem található!');

    const userDocRef = doc(this.firestore, 'Users', user.uid);
    const userSnap = await getDoc(userDocRef);
    if (!userSnap.exists()) throw new Error('Felhasználó nem található!');
    const userData = userSnap.data() as User;

    let post: Omit<ForumPost, 'id'> = {
      ...postData,
      poster: userData.username,
      posterUID: user.uid,
      createdAt: serverTimestamp(),
    };

    const forumDocRef =
      post.forumID === ForumTopic.CHARACTER
        ? doc(this.firestore, 'Forums', 'characters')
        : doc(this.firestore, 'Forums', 'adventures');
    const postsColRef = collection(forumDocRef, 'Posts');

    const docRef = await addDoc(postsColRef, post);

    return { ...post, id: docRef.id } as ForumPost;
  }

  getAllPosts(): Observable<{ charPosts: ForumPost[]; advPosts: ForumPost[] }> {
    const charPostsRef = query(
      collection(this.firestore, 'Forums', 'characters', 'Posts'),
      orderBy('createdAt', 'desc')
    );

    const advPostsRef = query(
      collection(this.firestore, 'Forums', 'adventures', 'Posts'),
      orderBy('createdAt', 'desc')
    );

    const charPosts$ = collectionData(charPostsRef, {
      idField: 'id',
    }) as Observable<ForumPost[]>;
    const advPosts$ = collectionData(advPostsRef, {
      idField: 'id',
    }) as Observable<ForumPost[]>;

    return combineLatest({ charPosts: charPosts$, advPosts: advPosts$ }).pipe(
      catchError((err) => {
        console.error('Hiba a postok lekérésekor: ', err);
        return of({ charPosts: [], advPosts: [] });
      })
    );
  }

  getMyPosts(): Observable<ForumPost[]> {
    return this.authService.currentUser.pipe(
      switchMap((user) => {
        if (!user) return of([] as ForumPost[]);

        const charQ = query(
          collection(this.firestore, 'Forums', 'characters', 'Posts'),
          where('posterUID', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

        const advQ = query(
          collection(this.firestore, 'Forums', 'adventures', 'Posts'),
          where('posterUID', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

        const charPosts$ = (
          collectionData(charQ, { idField: 'id' }) as Observable<ForumPost[]>
        ).pipe(
          map((posts) =>
            posts.map((p) => ({ ...p, forumId: 'characters' as const }))
          )
        );

        const advPosts$ = (
          collectionData(advQ, { idField: 'id' }) as Observable<ForumPost[]>
        ).pipe(
          map((posts) =>
            posts.map((p) => ({ ...p, forumId: 'adventures' as const }))
          )
        );

        return combineLatest([charPosts$, advPosts$]).pipe(
          map(([charPosts, advPosts]) =>
            [...charPosts, ...advPosts].sort((a: any, b: any) => {
              const ta = a.createdAt?.toMillis?.() ?? 0;
              const tb = b.createdAt?.toMillis?.() ?? 0;
              return tb - ta;
            })
          ),
          catchError((err) => {
            console.error('Hiba a postok lekérésekor: ', err);
            return of([] as ForumPost[]);
          })
        );
      })
    );
  }

  async deletePost(postID: string, forumID: ForumTopic): Promise<void> {
    try {
      const user = await firstValueFrom(
        this.authService.currentUser.pipe(take(1))
      );

      if (!user) throw new Error('Nem található felhasználó!');

      const userDocRef = doc(this.firestore, 'Users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) throw new Error('A felhasználó nem létezik!');

      const subForum =
        forumID === ForumTopic.CHARACTER ? 'characters' : 'adventures';
      const postDocRef = doc(
        this.firestore,
        'Forums',
        subForum,
        'Posts',
        postID
      );

      const commentsColRef = collection(
        this.firestore,
        'Forums',
        subForum,
        'Posts',
        postID,
        'Comments'
      );

      while (true) {
        const snap = await getDocs(query(commentsColRef, limit(450)));
        if (snap.empty) break;

        const batch = writeBatch(this.firestore);
        snap.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();
      }

      const finalBatch = writeBatch(this.firestore);
      finalBatch.delete(postDocRef);
      await finalBatch.commit();
    } catch (error) {
      console.error('Hiba a poszt törlésekor: ', error);
      throw error;
    }
  }

  getComments(
    postID: string,
    forumID: ForumTopic
  ): Observable<ForumPostComment[]> {
    const subForum =
      forumID === ForumTopic.CHARACTER ? 'characters' : 'adventures';
    const postCommentsRef = query(
      collection(
        this.firestore,
        'Forums',
        subForum,
        'Posts',
        postID,
        'Comments'
      ),
      orderBy('createdAt', 'desc')
    );

    return collectionData(postCommentsRef, { idField: 'id' }) as Observable<
      ForumPostComment[]
    >;
  }

  async addComment(
    text: string,
    forumID: ForumTopic,
    postID: string
  ): Promise<ForumPostComment> {
    const user = await firstValueFrom(
      this.authService.currentUser.pipe(take(1))
    );
    if (!user) throw new Error('Felhasználó nem található!');

    const userDocRef = doc(this.firestore, 'Users', user.uid);
    const userSnap = await getDoc(userDocRef);
    if (!userSnap.exists()) throw new Error('Felhasználó nem található!');
    const userData = userSnap.data() as User;

    const comment: Omit<ForumPostComment, 'id'> = {
      text: text,
      authorName: userData.username,
      authorUID: user.uid,
      createdAt: serverTimestamp(),
    };

    const forumDocRef =
      forumID === ForumTopic.CHARACTER
        ? doc(this.firestore, 'Forums', 'characters')
        : doc(this.firestore, 'Forums', 'adventures');
    const commentsColRef = collection(forumDocRef, 'Posts', postID, 'Comments');

    const docRef = await addDoc(commentsColRef, comment);

    return { ...comment, id: docRef.id } as ForumPostComment;
  }

  async deleteComment(
    commentID: string,
    forumID: ForumTopic,
    postID: string
  ): Promise<void> {
    try {
      const user = await firstValueFrom(
        this.authService.currentUser.pipe(take(1))
      );

      if (!user) throw new Error('Nem található felhasználó!');

      const userDocRef = doc(this.firestore, 'Users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) throw new Error('A felhasználó nem létezik!');

      const subForum =
        forumID === ForumTopic.CHARACTER ? 'characters' : 'adventures';

      const commentRef = doc(
        this.firestore,
        'Forums',
        subForum,
        'Posts',
        postID,
        'Comments',
        commentID
      );

      await deleteDoc(commentRef);
    } catch (error) {
      console.error("Hiba a komment törlésekor: ", error)
      throw error
    }
  }
}
