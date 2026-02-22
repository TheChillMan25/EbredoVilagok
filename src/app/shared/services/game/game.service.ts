import { Injectable } from '@angular/core';
import { Game, GameAction, Player, User } from '../../models/models';
import {
  doc,
  getDoc,
  collection,
  writeBatch,
  arrayUnion,
  query,
  where,
  documentId,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import {
  firstValueFrom,
  map,
  Observable,
  switchMap,
  take,
  of,
  catchError,
} from 'rxjs';
import { docData, Firestore, collectionData } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { GameErrorCauses } from '../../models/game_interfaces';

export enum PlayerRole {
  HOST = 'HOST',
  PLAYER = 'PLAYER',
}

export function checkRole(userId: string, ownerId: string): PlayerRole {
  if (userId === ownerId) {
    return PlayerRole.HOST;
  } else {
    return PlayerRole.PLAYER;
  }
}

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private _PlayerRole!: PlayerRole;

  constructor(private firestore: Firestore, private authService: AuthService) { }

  set PlayerRole(value: PlayerRole) {
    this._PlayerRole = value;
  }
  get PlayerRole() {
    return this._PlayerRole;
  }

  async createGame(
    game: Omit<Game, 'id' | 'ownerId' | 'ownerName'>
  ): Promise<Game> {
    try {
      const user = await firstValueFrom(
        this.authService.currentUser.pipe(take(1))
      );
      if (!user) throw new Error('Felhasználó nem található!');

      const userDocRef = doc(this.firestore, 'Users', user.uid);
      const userSnap = await getDoc(userDocRef);
      if (!userSnap.exists()) throw new Error('Felhasználó nem található!');
      const userData = userSnap.data() as User;

      if (userData.games.length === 3) {
        throw new Error('Maximum játék szám elérve, nem készíthető több!');
      }

      const gamesColRef = collection(this.firestore, 'Games');
      const gameDocRef = doc(gamesColRef);

      const newGame: Game = {
        ...game,
        id: gameDocRef.id,
        ownerId: user.uid,
        ownerName: userData.username as string,
      };

      const batch = writeBatch(this.firestore);
      batch.set(gameDocRef, newGame);
      batch.update(userDocRef, {
        games: arrayUnion(gameDocRef.id),
      });

      await batch.commit();

      return newGame;
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  }

  getGame(gameId: string): Observable<Game> {
    const gameDocRef = doc(this.firestore, 'Games', gameId);
    return docData(gameDocRef, { idField: 'id' }) as Observable<Game>;
  }

  getOpenPublicGames(): Observable<Game[]> {
    return this.authService.currentUser.pipe(
      switchMap((user) => {
        if (!user) return of([]);
        try {
          const gamesColRef = collection(this.firestore, 'Games');
          const q = query(
            gamesColRef,
            where('isPublic', '==', true),
            where('isOpen', '==', true),
            where('started', '==', false)
          );

          return (
            collectionData(q, { idField: 'id' }) as Observable<Game[]>
          ).pipe(
            map((games) => {
              return games.filter((game) => {
                const isHost = game.ownerId === user.uid;
                const isJoined = game.players?.some(
                  (player) => player.id === user.uid
                );
                const hasSpace = (game.players?.length || 0) < game.maxPlayers;

                return !isHost && !isJoined && hasSpace;
              });
            }),
            catchError((error) => {
              console.error('Hiba a stream közben:', error);
              return of([]);
            })
          );
        } catch (error) {
          console.error('Hiba a játékok lekérdezésekor: ', error);
          return of([]);
        }
      })
    );
  }

  getMyGames(): Observable<Game[]> {
    return this.authService.currentUser.pipe(
      switchMap((user) => {
        if (!user) return of([]);
        const userDocRef = doc(this.firestore, 'Users', user.uid);
        return docData(userDocRef).pipe(
          map((data) => (data as User).games || []),
          switchMap((gameIds) => {
            if (gameIds.length === 0) return of([]);
            const gamesCol = collection(this.firestore, 'Games');
            const q = query(gamesCol, where(documentId(), 'in', gameIds));
            return collectionData(q, { idField: 'id' }) as Observable<Game[]>;
          })
        );
      })
    );
  }

  async updateGame(
    gameId: string,
    updateData: Partial<Game>
  ): Promise<boolean> {
    try {
      const user = await firstValueFrom(
        this.authService.currentUser.pipe(take(1))
      );
      if (!user) throw new Error('Felhasználó nem található!');

      const gameDocRef = doc(this.firestore, 'Games', gameId);
      const gameSnap = await getDoc(gameDocRef);
      if (!gameSnap.exists()) throw new Error('A játék nem található!');

      const gameData = gameSnap.data() as Game;
      const isOwner = gameData.ownerId === user.uid;
      const isPlayer = gameData.players?.some((p) => p.id === user.uid);

      if (!isOwner && !isPlayer) {
        throw new Error('Nincs jogosultságod módosítani ezt a játékot!');
      }
      await updateDoc(gameDocRef, { ...updateData });
      return true;
    } catch (error) {
      console.error('Hiba a játék betöltésekor: ', error);
      throw error;
    }
  }

  async joinGame(
    gameId: string,
    player: Omit<Player, 'id' | 'name'>
  ): Promise<Game> {
    try {
      const user = await firstValueFrom(
        this.authService.currentUser.pipe(take(1))
      );
      if (!user) throw new Error('Felhasználó nem található!');
      const userDocRef = doc(this.firestore, 'Users', user.uid);
      const gameDocRef = doc(this.firestore, 'Games', gameId);
      const [userSnap, gameSnap] = await Promise.all([
        getDoc(userDocRef),
        getDoc(gameDocRef),
      ]);

      if (!userSnap.exists())
        throw new Error('Felhasználói profil nem található!');
      if (!gameSnap.exists()) throw new Error('A játék nem található!');
      const userData = userSnap.data() as User;
      const gameData = gameSnap.data() as Game;
      if (gameData.ownerId === user.uid) {
        throw new Error('Nem csatlakozhatsz a saját játékodhoz mint játékos!');
      }
      if (userData.inGame) {
        throw new Error('Már csatlakozva vagy egy játékhoz!', {cause: GameErrorCauses.AlreadyInGame});
      }
      const currentPlayers = gameData.players || [];
      if (currentPlayers.some((p) => p.id === user.uid)) {
        return { ...gameData };
      } else {
        if (!gameData.isOpen) {
          throw new Error('A csatlakozás nem engedélyezett (a játék zárva)!');
        } if (currentPlayers.length >= gameData.maxPlayers) {
          throw new Error('Nem lehet csatlakozni! Betelt a létszám.');
        }
        const newPlayer: Player = {
          ...player,
          name: userData.username as string,
          id: user.uid,
        };
        const batch = writeBatch(this.firestore);
        batch.update(userDocRef, { inGame: true });
        const updatedPlayers = [...currentPlayers, newPlayer];
        batch.update(gameDocRef, { players: updatedPlayers });
        await batch.commit();
        return { ...gameData, players: updatedPlayers };
      }
    } catch (error: any) {
      console.error('Join Error:', error);
      throw error;
    }
  }

  async leaveGame(gameId: string, role: PlayerRole): Promise<void> {
    try {
      const user = await firstValueFrom(
        this.authService.currentUser.pipe(take(1))
      );
      if (!user) throw new Error('Felhasználó nem található!');
      const userDocRef = doc(this.firestore, 'Users', user.uid);
      const userSnap = await getDoc(userDocRef);
      if (!userSnap.exists()) throw new Error('Felhasználó nem található!');
      const userData = userSnap.data() as User;

      let updateUserData: Partial<User> = { inGame: false };

      const batch = writeBatch(this.firestore);
      batch.update(userDocRef, updateUserData);

      const gameDocRef = doc(this.firestore, 'Games', gameId);
      const gameDoc = await getDoc(gameDocRef);
      if (!gameDoc.exists()) throw new Error('Játék nem található!');

      let updateData: Partial<Game> | null = null;

      switch (role) {
        case PlayerRole.HOST:
          updateData = {
            isOpen: false,
            players: [],
            started: false,
            currentPlayer: '',
            currentAction: {
              performer: {
                id: '',
                name: '',
              },
              primary: {} as GameAction,
              secondary: {} as GameAction,
            },
            vote: {
              theme: '',
              starter: '',
              votes: [],
            },
          };
          break;
        case PlayerRole.PLAYER:
          const gameData = gameDoc.data() as Game;
          const currentPlayer = gameData.playerOrder.find(
            (i) =>
              i.id !== gameData.currentPlayer &&
              !i.finished,
          )?.id || '';
          const newPlayers = gameData.players.filter((p) => p.id !== user.uid);
          const newPlayerOrder = gameData.playerOrder.filter((po) => po.id !== user.uid);
          updateData = { players: newPlayers, playerOrder: newPlayerOrder, currentPlayer };
          break;
        default:
          throw new Error('Nem lehet kezelni a szerepkört!');
      }

      if (updateData) {
        batch.update(gameDocRef, updateData);
      }
      await batch.commit();
    } catch (error: any) {
      console.error('Hiba a játék elhagyásakor: ', error);
      error.cause = GameErrorCauses.GameUpdateError;
      throw error;
    }
  }

  async deleteGame(gameId: string) {
    try {
      const user = await firstValueFrom(
        this.authService.currentUser.pipe(take(1))
      );
      if (!user) throw new Error('A felhasználó nem található!');
      const userDocRef = doc(this.firestore, 'Users', user.uid);
      const userSnap = await getDoc(userDocRef);
      if (!userSnap.exists()) throw new Error('Felhasználó nem található!');
      const userData = userSnap.data() as User;

      const updatedGames = userData.games.filter(g => g !== gameId);
      const gameDocRef = doc(this.firestore, 'Games', gameId);
      await deleteDoc(gameDocRef);
      return await updateDoc(userDocRef, { games: updatedGames });
    } catch (error) {
      console.error('Hiba a játék törlésekor: ', error);
      return;
    }
  }
}
