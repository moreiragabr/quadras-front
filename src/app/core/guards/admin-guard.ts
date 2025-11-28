import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/authService/auth-service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const routes = inject(Router);

  if(authService.isAdmin()){
    return true;
  }else{
    routes.navigate(['/']);
    return false;
  }
};
