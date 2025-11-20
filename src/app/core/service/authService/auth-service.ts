import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  router = inject(Router)
  private isAuthenticated = false;

  constructor(private http: HttpClient) { }

  API = "http://localhost:8080/api/auth/";

  deauthentication(): void {
    // localStorage.removeItem(this.TOKEN_KEY);
    // localStorage.removeItem(this.USER_KEY);
    this.isAuthenticated = false;
    // this.authToken = null;
    this.router.navigate(['']);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUserAdmin');
  }

  authenticate(): void {
    this.router.navigate(['']);
    localStorage.setItem('isAuthenticated', 'true');
  }

  isLogged(): boolean {
    if (localStorage.getItem('isAuthenticated') == 'true') {
      return true;
    } else {
      return false;
    }
  }

  isAdmin(): boolean {
    if (localStorage.getItem('currentUserAdmin') == 'true') {
      return true;
    } else {
      return false;
    }
  }

  getCurrentUserObject(): User | null {
    const userString = localStorage.getItem("currentUser");
    
    if (userString) {
      try {
        // Converte a string JSON de volta para o objeto User
        return JSON.parse(userString) as User;
      } catch (e) {
        console.error("AuthService: Erro ao desserializar o objeto de usuário:", e);
        return null;
      }
    }
    return null;
  }

  login(loginRequest: { email: string, senha: string }): Observable<User> {
    return this.http.post<User>(this.API + "login", loginRequest);
  }

  logout(): Observable<string> {
    return this.http.post<string>(this.API + "logout", { responseType: 'text' as 'json' });
  }

  register(registerRequest: { email: string, senha: string, nome: string }): Observable<User> {
    return this.http.post<User>(this.API + "registro", registerRequest);
  }

  currentUser(): Observable<string> {
    return this.http.delete<string>(this.API + "usuario-atual", { responseType: 'text' as 'json' });
  }
}
