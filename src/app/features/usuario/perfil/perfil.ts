import { Component, inject } from '@angular/core';
import { User } from '../../../core/models/user';
import { AuthService } from '../../../core/service/authService/auth-service';
import { UserService } from '../../../core/service/userService/user-service';
import { Quadra } from '../../../core/models/quadra';
import { RouterLink } from '@angular/router';
import { CapitalizePipe } from '../../../shared/pipes/capitalize-pipe';
import { Reserva } from '../../../core/models/reserva';
import { forkJoin, finalize, map, Observable, of } from 'rxjs'; // Imports RXJS
import { QuadraService } from '../../../core/service/quadraService/quadra-service';

// Interface local para tipagem segura, adicionando a Quadra
interface ReservaComQuadra extends Reserva {
  quadraDetalhada?: Quadra | null;
}

@Component({
  selector: 'app-perfil',
  imports: [RouterLink, CapitalizePipe],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss'
})
export class Perfil {

  authService = inject(AuthService);
  userService = inject(UserService);
  quadraSerice = inject(QuadraService);

  perfil: User | null = null;
  quadrasCadastradas: Quadra[] = [];
  reservasAgendadas: ReservaComQuadra[] = [];
  isLoading: boolean = true;

  ngOnInit(): void {
    this.carregarMeuPerfil();
  }

  carregarMeuPerfil(): void {

    const currentUser = this.authService.getCurrentUserValue();

    if (currentUser && currentUser.id) {
      const meuId = currentUser.id;
      console.log(`Carregando perfil para o ID do usuário logado: ${meuId}`);
      this.isLoading = true; // Inicia o loading

      this.userService.findUserById(meuId).subscribe({
        next: (data) => {
          this.perfil = data;
          console.log("Dados do perfil recebidos:", this.perfil);

          if (this.perfil) {
            this.quadrasCadastradas = this.perfil.quadras || [];
            const reservasIniciais: Reserva[] = this.perfil.reservas || [];

            // NOVO FLUXO: Chama a função para buscar as quadras
            this.carregarQuadrasDasReservas(reservasIniciais as ReservaComQuadra[]);

          } else {
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.error("Erro ao carregar perfil:", err);
          this.perfil = null;
          this.quadrasCadastradas = [];
          this.reservasAgendadas = [];
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  /**
   * Itera sobre as reservas, busca a Quadra usando o Campo ID e anexa a QuadraDetalhada à Reserva.
   */
  carregarQuadrasDasReservas(reservas: ReservaComQuadra[]): void {
    if (reservas.length === 0) {
      this.reservasAgendadas = [];
      this.isLoading = false;
      console.log("Reservas carregadas: 0");
      return;
    }

    // Array de Observables que serão executados em paralelo
    const quadraRequests: Observable<Quadra | null>[] = reservas.map(reserva => {
      const idCampo = reserva.campo?.id;

      if (idCampo) {
        // Chama o serviço para buscar a Quadra pelo ID do Campo
        return this.quadraSerice.findByCampoId(idCampo).pipe(
          map(quadra => quadra)
        );
      } else {
        // Se o campo for nulo ou sem ID, retorna um Observable de nulo
        return of(null);
      }
    });

    // forkJoin espera que todas as requisições secundárias terminem
    forkJoin(quadraRequests).pipe(
      finalize(() => this.isLoading = false) // Finaliza o loading após TODAS as buscas
    ).subscribe(quadrasDetalhada => {
      this.reservasAgendadas = reservas.map((reserva, index) => {
        // Anexa a QuadraDetalhada (resultado da busca) à Reserva
        reserva.quadraDetalhada = quadrasDetalhada[index];
        return reserva;
      });
      console.log(`Reservas carregadas e quadras anexadas: ${this.reservasAgendadas.length}`);
    });
  }

  /**
   * Formata a string LocalDateTime (ISO 8601) para uma data legível.
   */
  formatarData(isoString: string | undefined): string {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('pt-BR');
    } catch (e) {
      console.error("Erro ao formatar data:", isoString, e);
      return 'Data Inválida';
    }
  }

  /**
   * Formata a string LocalDateTime (ISO 8601) para a hora legível.
   */
  formatarHora(isoString: string | undefined): string {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch (e) {
      console.error("Erro ao formatar hora:", isoString, e);
      return 'Hora Inválida';
    }
  }
}