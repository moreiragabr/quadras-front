import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;

  logout(): void {
    // localStorage.removeItem(this.TOKEN_KEY);
    // localStorage.removeItem(this.USER_KEY);
    this.isAuthenticated = false;
    // this.authToken = null;
    // this.router.navigate(['/home']);
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
