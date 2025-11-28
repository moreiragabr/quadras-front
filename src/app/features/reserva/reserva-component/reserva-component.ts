import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Campo } from '../../../core/models/campo';
import { AuthService } from '../../../core/service/authService/auth-service';
import Swal from 'sweetalert2';

// Definições de tipos adaptadas ao seu modelo de Campo
interface HorarioSlot {
  horaInicio: string;
  horaFim: string;
  disponivel: boolean;
}

@Component({
  selector: 'app-agendamento',
  standalone: true,
  // Para Angular: Certifique-se de que HttpClientModule esteja no app.config
  imports: [CommonModule, FormsModule],
  providers: [DatePipe],
  // Usa os arquivos HTML e SCSS fornecidos (ou padrão)
  templateUrl: './reserva-component.html',
  styleUrl: './reserva-component.scss'
})
export class AgendamentoComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  public authService = inject(AuthService);
  private router = inject(Router);
  private datePipe = inject(DatePipe);

  quadraId!: number;
  hoje: string = this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '';
  dataSelecionada: string = this.hoje;

  campos: Campo[] = [];
  campoSelecionadoId: number | null = null;

  slots: HorarioSlot[] = [];
  // Variável para armazenar o slot selecionado
  slotSelecionado: HorarioSlot | null = null;

  mensagemSucesso: string | null = null;
  mensagemErro: string | null = null;

  private readonly apiUrl = 'http://localhost:8080/api/reservas';
  private readonly quadraApiUrl = 'http://localhost:8080/api/quadras';


  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.quadraId = +idParam;

      this.authService.isInitialized$.subscribe(isReady => {
        if (isReady) {
          this.buscarCamposDaQuadra();
          if (this.authService.isLoggedIn()) {
            // Chamamos carregarSlots aqui, mas ele só funcionará se houver um campo selecionado
            // O ideal é que ele seja chamado após a seleção de campo, ou após a pré-seleção
            this.carregarSlots();
          }
        }
      });
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  buscarCamposDaQuadra(): void {
    // Limpa a seleção e as mensagens ao iniciar a busca
    this.slotSelecionado = null;
    this.mensagemErro = this.authService.isLoggedIn() ? null : 'Faça login para realizar o agendamento.';

    this.http.get<Campo[]>(`${this.quadraApiUrl}/${this.quadraId}/campos`).subscribe({
      next: (data) => {
        this.campos = data;
        this.campoSelecionadoId = null;
        this.slots = [];

        if (data.length === 1) {
          // Garante a conversão de undefined para null
          this.campoSelecionadoId = data[0].id ?? null;
          this.carregarSlots();
        }
      },
      error: (err) => {
        console.error('Erro ao carregar campos:', err);
        this.mensagemErro = 'Não foi possível carregar os campos desta quadra.';
      }
    });
  }

  onCampoChange(campoId: number | null | undefined): void {
    this.campoSelecionadoId = campoId ?? null;
    this.slots = [];
    this.slotSelecionado = null; // Limpa a seleção ao mudar o campo
    if (this.campoSelecionadoId && this.dataSelecionada) {
      this.carregarSlots();
    }
  }

  onDataChange(novaData: string): void {
    this.dataSelecionada = novaData;
    this.slotSelecionado = null; // Limpa a seleção ao mudar a data
    if (this.campoSelecionadoId) {
      this.carregarSlots();
    }
  }

  carregarSlots(): void {
    if (!this.campoSelecionadoId || !this.dataSelecionada) return;

    this.slots = [];
    this.slotSelecionado = null; // Garante que a seleção é limpa
    this.mensagemErro = null;
    this.mensagemSucesso = null;

    const url = `${this.apiUrl}/slots/campo/${this.campoSelecionadoId}?data=${this.dataSelecionada}`;

    this.http.get<HorarioSlot[]>(url).subscribe({
      next: (data) => {
        this.slots = data;
      },
      error: (err) => {
        console.error('Erro ao carregar slots:', err);
        this.mensagemErro = 'Não foi possível carregar os horários. Verifique se o Back-End está rodando.';
      }
    });
  }

  // 💥 NOVO: Método para selecionar/desselecionar o slot no UI
  selecionarSlot(slot: HorarioSlot): void {
    // Se o slot clicado já estiver selecionado, deseleciona. Caso contrário, seleciona o novo slot.
    if (this.slotSelecionado === slot) {
      this.slotSelecionado = null;
    } else {
      this.slotSelecionado = slot;
      this.mensagemErro = null;
      this.mensagemSucesso = null;
    }
  }

  // 💥 NOVO: Método que executa a chamada POST para a API (Reserva)
  confirmarReserva(): void {
    if (!this.authService.isLoggedIn()) {
      this.mensagemErro = 'Você precisa estar logado para fazer uma reserva.';
      this.navigateToLogin();
      return;
    }

    if (!this.campoSelecionadoId || !this.slotSelecionado) {
      this.mensagemErro = 'Selecione um campo e um horário antes de confirmar.';
      return;
    }

    this.mensagemErro = null;
    this.mensagemSucesso = '... Processando reserva ...';

    const inicioReserva = `${this.dataSelecionada}T${this.slotSelecionado.horaInicio}:00`;

    const payload = {
      campoId: this.campoSelecionadoId,
      inicioReserva: inicioReserva
    };

    Swal.fire({
      title: "Confirmar agendamento?",
      text: "Data: " + this.dataSelecionada + "\n\nHorário: " + this.slotSelecionado.horaInicio,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0554F2",
      cancelButtonColor: "#ff4646ff",
      confirmButtonText: "Sim",
      cancelButtonText: "Não"
    }).then((result) => {
      if (result.isConfirmed) {

        this.http.post(this.apiUrl, payload).subscribe({
          next: () => {
            this.mensagemSucesso = `✅ Reserva efetuada com sucesso no Campo ID ${this.campoSelecionadoId} para ${this.slotSelecionado!.horaInicio}!`;
            this.slotSelecionado = null; // Limpa a seleção após o sucesso
            this.carregarSlots(); // Recarrega os slots para atualizar o estado
          },
          error: (err) => {
            console.error('Erro na reserva:', err);
            this.slotSelecionado = null; // Limpa a seleção em caso de erro

            let errorMessage = '❌ Erro desconhecido ao tentar reservar. Tente novamente.';
            if (err.status === 401 || err.status === 403) {
              errorMessage = 'Sessão expirada ou não autorizada. Por favor, faça login novamente.';
              this.authService.logout();
            } else if (err.status === 400) {
              errorMessage = '❌ Horário indisponível. Conflito de agendamento ou slot já ocupado.';
            }
            this.mensagemErro = errorMessage;
            this.mensagemSucesso = null; // Limpa a mensagem de processamento
          }
        });

        Swal.fire({
          title: "Horário agendado com sucesso!",
          icon: "success"
        });

        this.router.navigate(['/perfil']);
      }
    });
  }
}