import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/authService/auth-service';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';


export const notAutGuardGuard: CanActivateFn = (route, state): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isInitialized$.pipe(
    map(() => {
      if (authService.isLoggedIn()) {
        return false;
      } else {
        return true;
      }
    }),
    tap(canActivate => {
      if (!canActivate) {
        router.navigate(['/']);
      }
    })
  );
};