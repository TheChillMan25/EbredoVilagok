import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { screenGuard } from './screen.guard';

describe('screenGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => screenGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
