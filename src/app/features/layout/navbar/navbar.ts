import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/service/authService/auth-service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common'; // Módulos necessários
import { User } from '../../../core/models/user';
import { FirstNamePipe } from '../../../shared/pipes/first-name-pipe';

@Component({
  selector: 'app-navbar',
  // IMPORTANTE: Adicionar NgIf e AsyncPipe aos imports para uso no template
  standalone: true, // Assumindo que o componente é standalone
  imports: [RouterLink, RouterModule, AsyncPipe, FirstNamePipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  
  authService = inject(AuthService);
  
  // 1. Variável reativa: Armazena o Observable do usuário
  currentUser$: Observable<User | null> = this.authService.currentUser$;

  // 2. Removemos ngOnInit, pois a assinatura é feita diretamente na inicialização do componente

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
      }
    });
  }
}