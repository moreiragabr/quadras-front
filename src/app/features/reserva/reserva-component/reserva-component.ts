import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; 
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
// Assumindo que você tem o AuthService
// import { AuthService } from '../../../core/service/authService/auth-service'; 

// Definições de tipos adaptadas ao seu modelo de Campo
interface HorarioSlot {
  horaInicio: string; 
  horaFim: string;    
  disponivel: boolean;
}

// Usando o seu modelo de Campo
interface Campo {
  id: number;
  identificador: number;
  nome: string;
  // A Quadra não precisa ser incluída aqui
}

@Component({
  selector: 'app-agendamento',
  standalone: true,
  // Para Angular: Certifique-se de que HttpClientModule esteja no app.config
  imports: [CommonModule, FormsModule],
  providers: [DatePipe], 
  templateUrl: './reserva-component.html'
})
export class AgendamentoComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  // private authService = inject(AuthService); // Comentei pois não forneceu a classe
  private router = inject(Router);
  private datePipe = inject(DatePipe);

  quadraId!: number;
  hoje: string = this.datePipe.transform(new Date(), 'yyyy-MM-dd') || ''; 
  dataSelecionada: string = this.hoje; 
  
  campos: Campo[] = [];
  campoSelecionadoId: number | null = null; 

  slots: HorarioSlot[] = [];
  
  mensagemSucesso: string | null = null;
  mensagemErro: string | null = null;

  private readonly apiUrl = 'http://localhost:8080/api/reservas';
  // 💥 NOVO: Endpoint para buscar campos da quadra
  private readonly quadraApiUrl = 'http://localhost:8080/api/quadras'; 


  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.quadraId = +idParam;
      this.buscarCamposDaQuadra(); 
    }
  }
  
  buscarCamposDaQuadra(): void {
    // 💥 Exemplo de endpoint para buscar todos os campos de uma quadra
    this.http.get<Campo[]>(`${this.quadraApiUrl}/${this.quadraId}/campos`).subscribe({
      next: (data) => {
        this.campos = data;
        this.campoSelecionadoId = null; // Reseta a seleção
        this.slots = []; // Limpa os slots

        // Se houver apenas 1 campo, pré-seleciona
        if (data.length === 1) {
          this.campoSelecionadoId = data[0].id;
          this.carregarSlots();
        }
      },
      error: (err) => {
        console.error('Erro ao carregar campos:', err);
        this.mensagemErro = 'Não foi possível carregar os campos desta quadra.';
      }
    });
  }

  onCampoChange(campoId: number | null): void {
    this.campoSelecionadoId = campoId;
    this.slots = []; // Limpa slots ao mudar o campo
    if (campoId && this.dataSelecionada) {
      this.carregarSlots(); 
    }
  }

  onDataChange(novaData: string): void {
    this.dataSelecionada = novaData;
    if (this.campoSelecionadoId) {
      this.carregarSlots(); 
    }
  }

  carregarSlots(): void {
    if (!this.campoSelecionadoId || !this.dataSelecionada) return;

    this.slots = [];
    this.mensagemErro = null;
    this.mensagemSucesso = null;
    
    // 💥 Endpoint: GET /api/reservas/slots/campo/{campoId}?data=YYYY-MM-DD
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

  reservar(slot: HorarioSlot): void {
    // ⚠️ ATENÇÃO: Adicione aqui a verificação de autenticação (usando o AuthService real)
    // if (!this.authService.getCurrentUserValue()) {
    //   this.mensagemErro = 'Você precisa estar logado para fazer uma reserva.';
    //   return;
    // }
    
    this.mensagemErro = null;
    this.mensagemSucesso = null;

    if (!this.campoSelecionadoId) {
        this.mensagemErro = 'Selecione um campo antes de reservar.';
        return;
    }

    const inicioReserva = `${this.dataSelecionada}T${slot.horaInicio}:00`;

    const payload = {
      campoId: this.campoSelecionadoId, // O campo ID do DTO de requisição
      inicioReserva: inicioReserva 
    };

    // Chamada POST para criar a reserva.
    this.http.post(this.apiUrl, payload).subscribe({
      next: () => {
        this.mensagemSucesso = `Reserva efetuada com sucesso no Campo ID ${this.campoSelecionadoId} para ${slot.horaInicio}!`;
        this.carregarSlots(); 
      },
      error: (err) => {
        console.error('Erro na reserva:', err);
        this.mensagemErro = err.status === 400 
            ? 'Horário indisponível. Conflito de agendamento.' 
            : 'Erro desconhecido ao tentar reservar. Tente novamente.';
      }
    });
  }
}