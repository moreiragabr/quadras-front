import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/service/authService/auth-service';
import { QuadraService } from '../../../core/service/quadraService/quadra-service';
import { FormsModule } from '@angular/forms';
import { CampoSelecionado } from '../../../core/models/campo';
import { OperatingHoursComponent } from './horario-funcionamento/horario-funcionamento';
import { CampoFinal } from '../../../core/models/campoFinal';
import { User } from '../../../core/models/user';
import { ItemSelectorComponent } from './item-seletor/item-seletor';
import { QuadraFormState, QuadraRegistrationService } from '../../../core/service/quadraRegistrationService/quadra-registration-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-quadras-add',
  imports: [FormsModule, ItemSelectorComponent, OperatingHoursComponent],
  templateUrl: './quadras-add.html',
  styleUrl: './quadras-add.scss'
})
export class QuadrasAdd {
  quadraService = inject(QuadraService);
  authService = inject(AuthService);
  stateService = inject(QuadraRegistrationService);
  router = inject(Router);

  newQuadra: Partial<QuadraFormState> = this.stateService.getState();


  // newQuadra = {
  //   nome: '',
  //   tipoQuadra: '',
  //   proprietario: this.authService.getCurrentUserObject(),
  //   descricao: '',
  //   valorHora: 0,
  //   partidaGravavel: false,
  //   estado: '',
  //   cidade: '',
  //   bairro: '',
  //   rua: '',
  //   numeroCasa: '',
  //   lot: '',
  //   lat: '',
  //   haveWifi: false,
  //   haveEscolinha: false,
  //   haveLanchonete: false,
  //   haveBar: false,
  //   haveEstacionamento: false,
  //   haveVestiario: false,
  //   haveChurrasqueira: false,
  //   haveTv: false,
  //   haveOutros: false,
  //   outrosDesc: '',
  //   horariosDeFuncionamento: [] as any[],
  //   campos: [] as any[]
  // };

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
    if (!this.newQuadra.campos) {
      this.newQuadra.campos = [];
    } else {
      this.newQuadra.campos.length = 0;
    }
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

    const partialData = {
      nome: this.newQuadra.nome,
      tipoQuadra: this.newQuadra.tipoQuadra,
      proprietario: this.authService.getCurrentUserObject(),
      descricao: this.newQuadra.descricao,
      haveWifi: this.newQuadra.haveWifi,
      haveEscolinha: this.newQuadra.haveEscolinha,
      haveLanchonete: this.newQuadra.haveLanchonete,
      haveBar: this.newQuadra.haveBar,
      haveEstacionamento: this.newQuadra.haveEstacionamento,
      haveVestiario: this.newQuadra.haveVestiario,
      haveChurrasqueira: this.newQuadra.haveChurrasqueira,
      haveTv: this.newQuadra.haveTv,
      haveOutros: this.newQuadra.haveOutros,
      outrosDesc: this.newQuadra.outrosDesc,
      horariosDeFuncionamento: this.newQuadra.horariosDeFuncionamento,
      campos: this.newQuadra.campos
    };

    this.stateService.updateState(partialData);

    console.log(partialData);
  
    this.router.navigate(['nova-quadra-2']);
  }
}


