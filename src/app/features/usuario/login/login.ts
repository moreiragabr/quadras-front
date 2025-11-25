import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../../core/service/authService/auth-service';
import { LoginRequest } from '../../../core/models/loginRequest';

@Component({
  selector: 'app-login',
  standalone: true, // Certifique-se de que está marcado como standalone
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent { // Renomeado para LoginComponent por convenção

  authService = inject(AuthService);
  router = inject(Router);

  // DTO de requisição tipado
  loginRequest: LoginRequest = { email: '', senha: '' };

  // Variável para armazenar mensagens de erro específicas
  errorMessage: string | null = null;

  login() {

    // 1. Validação básica
    if (!this.loginRequest.email || !this.loginRequest.senha) {
      Swal.fire({
        title: 'Insira todos os dados!',
        icon: 'warning',
      });
      return;
    }

    // 2. Chama o método login do Service
    this.authService.login(this.loginRequest).subscribe({

      // Sucesso: O Service já salvou o token e atualizou o estado.
      next: (response) => {

        this.router.navigate(['/home']);

      },

      // Erro: O Service lança um 'Error' com a mensagem de falha.
      error: (error: Error) => {
        // Exibimos a mensagem de erro que veio do catchError do AuthService.
        const msg = error.message;

        // Exibe o erro usando SweetAlert
        Swal.fire({
          title: 'Falha no Login',
          text: msg || 'Ocorreu um erro desconhecido.',
          icon: 'error',
        });

        // Limpa a mensagem de erro interna após a exibição
        this.errorMessage = msg;
      }
    });
  }
}