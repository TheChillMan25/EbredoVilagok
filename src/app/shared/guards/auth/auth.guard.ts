import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.currentUser.pipe(
    take(1),
    map((user) => {
      if (user) {
        return true;
      }
      router.navigateByUrl('login');
      return false;
    })
  );
};

export const publicGuard: CanActivateFn = (route, state) => {
  return true;
};
