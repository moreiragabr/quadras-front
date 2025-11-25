import { Component, inject, Inject } from '@angular/core';
import { User } from '../../../core/models/user';
import { AuthService } from '../../../core/service/authService/auth-service';
import { UserService } from '../../../core/service/userService/user-service';
import { Quadra } from '../../../core/models/quadra';
import { RouterLink } from '@angular/router';
import { CapitalizePipe } from '../../../shared/pipes/capitalize-pipe';

@Component({
  selector: 'app-perfil',
  imports: [RouterLink, CapitalizePipe],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss'
})
export class Perfil {

  authService = inject(AuthService);
  userService = inject(UserService);

  perfil: User | null = null;
  quadrasCadastradas: Quadra[] = [];

  ngOnInit(): void {
    this.carregarMeuPerfil();
  }

  carregarMeuPerfil(): void {

    const currentUser = this.authService.getCurrentUserValue();

    if (currentUser && currentUser.id) {
      const meuId = currentUser.id;
      console.log(`Carregando perfil para o ID do usuário logado: ${meuId}`);

      // 2. Chama a API para buscar os dados. O endpoint da API pode ser:
      // a) /api/usuarios/{id} (Se o UserService recebe o ID)
      // b) /api/usuarios/me (Se a API for inteligente e usa o token para saber quem é 'me')

      this.userService.getUserById(meuId).subscribe({
        next: (data) => {
          this.perfil = data;
          console.log(this.perfil);

          if (this.perfil.quadras) {
            this.quadrasCadastradas = this.perfil.quadras;
          } else {
            this.quadrasCadastradas = [];
          }
        },
        error: (err) => {
          console.error("Erro ao carregar perfil:", err);
          this.perfil = null;
          this.quadrasCadastradas = [];
        }
      });
    }
  }
}
