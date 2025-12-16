import { CanDeactivateFn } from '@angular/router';
import { CanComponentDeactivate } from '../../../pages/creator/karakter/karakter.component';

export const deactivateGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component
) => {
  if (component.canDeactivate) return component.canDeactivate();
  return true;
};
