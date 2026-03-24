import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { map, of, switchMap, take } from 'rxjs';
import { GameService } from '../../services/game/game.service';

export const authGuard: CanActivateFn = (_route, _state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.currentUser.pipe(
    take(1),
    map((user) => {
      if (user) {
        return true;
      }
      router.navigateByUrl('/login');
      return false;
    })
  );
};

export const publicGuard: CanActivateFn = (_route, _state) => {
  return true;
};

export const gameGuard: CanActivateFn = (route, _state) => {
  const gameService = inject(GameService);
  const router = inject(Router);
  const authService = inject(AuthService);

  const gameId = route.paramMap.get('id');

  if (!gameId) return false;

  return authService.currentUser.pipe(
    take(1),
    switchMap((user) => {
      if (!user) return of(router.createUrlTree(['/login']));

      return gameService.getGame(gameId).pipe(
        take(1),
        map((game) => {
          if (!game) return router.createUrlTree(['/jatek']);
          const isPlayer = game.players.some((p) => p.id === user.uid);
          const isHost = game.ownerId === user.uid;
          if (isPlayer || isHost) return true;
          return router.createUrlTree(['/jatek']);
        })
      );
    })
  );
};
