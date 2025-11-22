import { Injectable, signal } from '@angular/core';
import { Campo } from '../../models/campo';
// import { Horario } from '../../models/horario';
import { User } from '../../models/user';
import { HorarioDia } from '../../models/horarioDia';

export interface QuadraFormState {
    nome?: string;
    // nota?:string;
    valorHora?: number;
    descricao?: string;
    // partidaGravavel?: boolean;
    localizacao?: string;
    cidade?: string;
    estado?: string;
    bairro?: string;
    rua?: string;
    cep?: string;
    numeroCasa?: string;
    lot?: string;
    lat?: string;
    tipoQuadra?: string;
    proprietario?: User;
    haveWifi?: boolean;
    haveEscolinha?: boolean;
    haveLanchonete?: boolean;
    haveBar?: boolean;
    haveEstacionamento?: boolean;
    haveVestiario?: boolean;
    haveChurrasqueira?: boolean;
    haveTv?: boolean;
    haveOutros?: boolean;
    outrosDesc?: string;
    horariosDeFuncionamento?:HorarioDia[];
    campos?:Campo[];
}

@Injectable({
  providedIn: 'root'
})
export class QuadraRegistrationService {

  private initialState: QuadraFormState = {
    nome: '',
    valorHora: 0,
    descricao:'',
    estado: '', cidade: '', bairro: '', rua: '', numeroCasa: '', lot: '', lat: '', cep:'',
    tipoQuadra: '',
    proprietario: undefined,
    haveBar: false,
    haveChurrasqueira: false,
    haveEscolinha: false,
    haveEstacionamento: false,
    haveLanchonete: false,
    haveOutros: false,
    haveTv: false,
    haveVestiario: false,
    haveWifi: false,
    outrosDesc: '',
    horariosDeFuncionamento: [],
    campos: [] as any[],
  };

  public quadraState = signal<QuadraFormState>(this.initialState);

  updateState(partialState: Partial<QuadraFormState>): void {
    this.quadraState.update(current => ({
      ...current,
      ...partialState
    }));
  }

  getState(): QuadraFormState {
    return this.quadraState();
  }

  resetState(): void {
    this.quadraState.set(this.initialState);
  }
}
