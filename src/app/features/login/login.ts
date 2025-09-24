import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/service/authService/auth-service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  authService = inject(AuthService);
  router = inject(Router);
  errorMessage?: string;
  loginRequest = { email: '', senha: '' };

  login() {

    if (!this.loginRequest.email || !this.loginRequest.senha) {
      Swal.fire({
        title: 'Insira todos os dados!',
        icon: 'warning',
      })
      return;
    }

    this.authService.login(this.loginRequest).subscribe({

      next: (user) => {
        console.log(user)
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.authService.authenticate();
      },

      error: (error) => {
        if (error.status === 401) {
          this.errorMessage = 'Email ou senha incorretos';
        } else if (error.status === 403) {
          this.errorMessage = 'Acesso negado. Verifique suas permissões.';
        } else if (error.status === 0) {
          this.errorMessage = 'Erro de conexão. Verifique se o servidor está rodando.';
        } else {
          this.errorMessage = 'Erro inesperado. Tente novamente.';
        }
        Swal.fire({
          title: this.errorMessage,
          icon: 'warning',
        })
      }
    });
  }

}
