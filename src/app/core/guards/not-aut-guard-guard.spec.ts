import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { notAutGuardGuard } from './not-aut-guard-guard';

describe('notAutGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => notAutGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
