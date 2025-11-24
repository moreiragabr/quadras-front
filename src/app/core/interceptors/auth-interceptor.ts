import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../service/authService/auth-service'; // Garanta que este caminho está correto

/**
 * Interceptor funcional para anexar o Token JWT (Bearer) a todas as requisições protegidas.
 */
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  
  // 1. Injeta o AuthService. Como o AuthService é 'providedIn: root', 
  // esta injeção geralmente é segura, mas inicia o ciclo.
  const authService = inject(AuthService);
  const token = authService.getToken();

  // 2. Quebrando o ciclo: Evitar que o interceptor atue na requisição que causou o ciclo.
  // A requisição causadora do ciclo é a de validação de token (loadUserFromToken).
  
  const backendUrl = 'http://localhost:8080/api/'; 
  
  // Condição para injetar o token:
  if (token && req.url.startsWith(backendUrl) && !req.url.includes('/api/auth/login') && !req.url.includes('/api/auth/registro')) {
    
    // **Ajuste CRÍTICO:** O método loadUserFromToken faz um GET em '/usuario-atual'.
    // Se essa requisição GET estiver sendo feita durante a inicialização do AuthService,
    // o interceptor precisa permitir que ela passe ou ela precisa ter o token.
    // O problema real é a ordem de inicialização.

    // Vamos apenas usar a injeção direta, que é o padrão para interceptores funcionais:
    
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    
    return next(cloned);
  }

  // Se não houver token ou for uma rota pública, passa a requisição original
  return next(req);
};