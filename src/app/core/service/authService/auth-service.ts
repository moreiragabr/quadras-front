import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { LoginRequest } from '../../models/loginRequest';
import { LoginResponse } from '../../models/loginResponse';
import { environment } from '../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_KEY = environment.SERVIDOR; 

  private readonly apiUrl = `${this.API_KEY}/api/auth`;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  private http = inject(HttpClient);
  private router = inject(Router);

  private isInitializedSubject = new BehaviorSubject<boolean>(false);
  public isInitialized$ = this.isInitializedSubject.asObservable();


  constructor() {
    this.loadUserFromStorage();
  }

  public initializeSession(): void {
    this.loadUserFromToken();
  }

  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem(this.USER_KEY);
    if (storedUser) {
      try {
        this.currentUserSubject.next(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem(this.USER_KEY);
      }
    }
  }


  login(credentials: LoginRequest): Observable<LoginResponse> {
    const url = `${this.apiUrl}/login`;
    return this.http.post<LoginResponse>(url, credentials).pipe(
      tap(response => {
        this.storeToken(response.token);

        const user: User = {
          id: response.id,
          nome: response.nome,
          email: response.email,
          role: response.role
        };
        this.storeUser(user);
        this.currentUserSubject.next(user);

        console.log('Login bem-sucedido. Usuário logado:', user);
      }),
      catchError(error => {
        console.error('Falha no login:', error);
        return throwError(() => new Error('Credenciais inválidas ou erro de servidor.'));
      })
    );
  }


  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
    console.log('Logout realizado.');
  }

  getCurrentUserValue(): User | null {
    return this.currentUserSubject.getValue();
  }


  register(user: any): Observable<any> {
    const url = `${this.apiUrl}/registro`;
    return this.http.post(url, user);
  }


  isAuthenticated(): boolean {
    return !!this.getToken();
  }


  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.currentUserSubject.getValue();
  }


  isAdmin(): boolean {
    const user = this.currentUserSubject.getValue();
    return !!user && user.role === 'SYSJEGG_ADMIN';
  }


  getRole(): string | null {
    const user = this.currentUserSubject.getValue();
    return user ? user.role : null;
  }



  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }


  private storeToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private storeUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }


  private loadUserFromToken(): void {
    const token = this.getToken();
    if (!token) {
      this.logout();
      this.isInitializedSubject.next(true);
      return;
    }


    const url = `${this.apiUrl}/usuario-atual`;

    this.http.get<User>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          console.warn('Token inválido ou expirado. Deslogando...');
          this.logout();
        } else {
          console.error('Erro ao verificar usuário atual:', error);
        }
        return of(null);
      })
    ).subscribe(user => {
      if (user) {
        this.storeUser(user);
        this.currentUserSubject.next(user);
        console.log('Sessão restaurada para:', user.email);
      } else {
        this.logout();
      }
      this.isInitializedSubject.next(true);
    });
  }
}