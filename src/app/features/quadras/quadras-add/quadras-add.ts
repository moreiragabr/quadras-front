import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/service/authService/auth-service';
import { QuadraService } from '../../../core/service/quadraService/quadra-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quadras-add',
  imports: [FormsModule],
  templateUrl: './quadras-add.html',
  styleUrl: './quadras-add.scss'
})
export class QuadrasAdd {
  quadraService = inject(QuadraService);
  authService = inject(AuthService);

  newQuadra = {
    nome: '',
    tipoQuadra: '',
    proprietario: localStorage.getItem("currentUser"),
    descricao: '',
    valorHora: 0,
    partidaGravavel: false,
    estado: '',
    cidade: '',
    bairro: ''
  };

}
