import { CanActivateFn, Router } from '@angular/router';
import { isMobileView } from '../../../pages/map/map.component';
import { inject } from '@angular/core';

export const screenGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  if (isMobileView()) {
    router.navigate(['/jatek']);
  }
  return !isMobileView();
};
