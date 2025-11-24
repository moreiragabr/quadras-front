import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { LoginRequest } from '../../models/loginRequest';
import { LoginResponse } from '../../models/loginResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = 'http://localhost:8080/api/auth';

  // Variável reativa para rastrear o estado de login do usuário atual
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();


  // Chave de armazenamento local para o Token JWT
  private readonly TOKEN_KEY = 'auth_token';

  private http = inject(HttpClient);
  private router = inject(Router);

  constructor() {
    // IMPORTANTE: O construtor está vazio. A lógica de inicialização 
    // é movida para initializeSession() para quebrar o ciclo de dependência.
  }

  public initializeSession(): void {
    this.loadUserFromToken();
  }


  /**
   * Tenta fazer o login com as credenciais fornecidas.
   * Em caso de sucesso, armazena o token e o estado do usuário.
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    const url = `${this.apiUrl}/login`;
    return this.http.post<LoginResponse>(url, credentials).pipe(
      tap(response => {
        // 1. Armazena o Token JWT para ser usado pelo Interceptor
        this.storeToken(response.token);

        // 2. Extrai e armazena os dados públicos do usuário
        const user: User = {
          id: response.id,
          nome: response.nome,
          email: response.email,
          role: response.role
        };
        this.currentUserSubject.next(user);

        console.log('Login bem-sucedido. Usuário logado:', user);
      }),
      catchError(error => {
        console.error('Falha no login:', error);
        // Lança o erro para que o componente que chamou possa exibir uma mensagem
        return throwError(() => new Error('Credenciais inválidas ou erro de servidor.'));
      })
    );
  }

  /**
   * Realiza o processo de logout.
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
    console.log('Logout realizado.');
  }

  getCurrentUserValue(): User | null {
    return this.currentUserSubject.getValue();
  }

  /**
   * Faz a requisição de registro de um novo usuário.
   * Não armazena o token, pois o registro geralmente não loga automaticamente.
   */
  register(user: any): Observable<any> {
    const url = `${this.apiUrl}/registro`;
    // Retorna o Observable, o componente deve lidar com o .subscribe()
    return this.http.post(url, user);
  }

  /**
   * Verifica se o usuário está autenticado (se o token existe).
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
 * Verifica se o usuário atual está logado.
 * @returns true se o token existir e o estado do usuário estiver preenchido.
 */
  isLoggedIn(): boolean {
    // É considerado logado se houver um token e um usuário no BehaviorSubject
    return !!this.getToken() && !!this.currentUserSubject.getValue();
  }

  /**
   * Verifica se o usuário atual possui a role 'ADMIN'.
   * @returns true se o usuário estiver logado e tiver a role 'ADMIN'.
   */
  isAdmin(): boolean {
    const user = this.currentUserSubject.getValue();
    // Verifica se há um usuário e se a role é 'ADMIN'
    return !!user && user.role === 'ADMIN';
  }

  /**
   * Retorna a role do usuário logado ou null se não estiver logado.
   */
  getRole(): string | null {
    const user = this.currentUserSubject.getValue();
    return user ? user.role : null;
  }


  /**
   * Obtém o Token JWT armazenado.
   */
  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Armazena o token no localStorage.
   */
  private storeToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Tenta restaurar e validar o estado de login a partir do token existente,
   * fazendo uma chamada ao Back-End.
   */
  private loadUserFromToken(): void {
    const token = this.getToken();
    if (!token) {
      // Sem token, sem login.
      this.currentUserSubject.next(null);
      return;
    }

    // Faz uma chamada protegida ao BE para validar o token e obter dados.
    // **IMPORTANTE**: Esta chamada SÓ FUNCIONARÁ se você tiver um Interceptor 
    // que anexa o token ao cabeçalho 'Authorization'.
    const url = `${this.apiUrl}/usuario-atual`;

    // O tipo esperado agora é CurrentUser, que reflete o UserResponseDTO do BE
    this.http.get<User>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        // Se o token for inválido (401) ou expirado, limpamos o estado.
        if (error.status === 401 || error.status === 403) {
          console.warn('Token inválido ou expirado. Deslogando...');
          this.logout();
        } else {
          console.error('Erro ao verificar usuário atual:', error);
        }
        // Retorna um Observable vazio para encerrar a cadeia
        return of(null);
      })
    ).subscribe(user => {
      if (user) {
        // Token válido, BE retornou dados do usuário.
        this.currentUserSubject.next(user);
        console.log('Sessão restaurada para:', user.email);
      } else {
        // Erro tratado no catchError, ou seja, deslogado.
        this.currentUserSubject.next(null);
      }
    });
  }
}