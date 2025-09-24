import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/service/authService/auth-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  authService = inject(AuthService);

  sair() {
    Swal.fire({
      title: "Deseja sair de sua conta?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0554F2",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim",
      cancelButtonText: "Não"
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        this.authService.deauthentication();
      }
    });
  }
}
