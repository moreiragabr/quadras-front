import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/service/authService/auth-service';
import { QuadraService } from '../../../core/service/quadraService/quadra-service';
import { FormsModule } from '@angular/forms';
import { ItemSelectorComponent } from '../../item-seletor/item-seletor';
import { CampoSelecionado } from '../../../core/models/campo';
import { OperatingHoursComponent } from '../../horario-funcionamento/horario-funcionamento';
import { CampoFinal } from '../../../core/models/campoFinal';
import { User } from '../../../core/models/user';

@Component({
  selector: 'app-quadras-add',
  imports: [FormsModule, ItemSelectorComponent, OperatingHoursComponent],
  templateUrl: './quadras-add.html',
  styleUrl: './quadras-add.scss'
})
export class QuadrasAdd {
  quadraService = inject(QuadraService);
  authService = inject(AuthService);

  newQuadra = {
    nome: '',
    tipoQuadra: '',
    proprietario: this.authService.getCurrentUserObject(),
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
    horariosDeFuncionamento: [] as any[],
    campos: [] as any[]
  };

  itensSelecionados: CampoSelecionado[] = [];

  onSchedulesReceived(schedulesData: any[]) {
    this.newQuadra.horariosDeFuncionamento = schedulesData;
    console.log('Dados de Horários recebidos no Componente Pai (X):', schedulesData);
  }

  onItensChange(itens: CampoSelecionado[]): void {
    this.itensSelecionados = itens;
    console.log('Itens atualizados:', itens);
  }

  nextStep() {
    this.newQuadra.campos.length = 0;
    let sequentialId = 0;

    for (const item of this.itensSelecionados) {
      const nomeBase = item.nome;
      const quantidade = item.quantidade;

      for (let i = 1; i <= quantidade; i++) {
        const nomeUnico = `${nomeBase} ${i}`;

        const novaQuadraFinal: CampoFinal = {
          id: sequentialId,
          nome: nomeUnico,
        };

        this.newQuadra.campos.push(novaQuadraFinal);
        sequentialId++;
      }
    }
    console.log(this.newQuadra);
  }
}


