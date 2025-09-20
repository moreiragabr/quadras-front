import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  router = inject(Router)
  private isAuthenticated = false;

  logout(): void {
    // localStorage.removeItem(this.TOKEN_KEY);
    // localStorage.removeItem(this.USER_KEY);
    this.isAuthenticated = false;
    // this.authToken = null;
    this.router.navigate(['']);
  }

  login(): void{
    this.isAuthenticated = true;
  }

  isLogged(): boolean {
    if (this.isAuthenticated) {
      return true;
    } else {
      return false;
    }
  }

}
