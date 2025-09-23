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

  email!: string;
  senha!: string;

  login() {
    console.log(this.email, this.senha)
    if (this.email == "admin" && this.senha == "admin") {
      this.authService.login();
      this.router.navigate(['']);
    } else {
      Swal.fire({
        title: 'Senha ou email incorretos!',
        icon: 'warning',
      })
    }
  }

}
