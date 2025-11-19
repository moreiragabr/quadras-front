import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/service/authService/auth-service';
import { QuadraService } from '../../../core/service/quadraService/quadra-service';
import { FormsModule } from '@angular/forms';
import { ItemSelectorComponent } from '../../item-seletor/item-seletor';
import { CampoSelecionado } from '../../../core/models/campo';

@Component({
  selector: 'app-quadras-add',
  imports: [FormsModule, ItemSelectorComponent],
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
    bairro: '',
    rua: '',
    numeroCasa: '',
    lot: '',
    lat: '',
    haveWifi: false,
    haveEscolinha: false,
    haveLanchonete: false,
    haveBar: false,
    haveEstacionamento: false,
    haveVestiario: false,
    haveChurrasqueira: false,
    haveTv: false,
    haveOutros: false,
    outrosDesc: '',
  };

  itensSelecionados: CampoSelecionado[] = [];

  onItensChange(itens: CampoSelecionado[]): void {
    this.itensSelecionados = itens;
    console.log('Itens atualizados:', itens);
  }


}
