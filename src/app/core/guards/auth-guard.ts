import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/authService/auth-service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const routes = inject(Router);

  if (authService.isLoggedIn()){
    return true;
  }else{
    routes.navigate(['/login'])
    return false;
  }
};
