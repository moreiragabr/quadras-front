import { Quadra } from "./quadra";

export interface Campo {
  id?: number;
  identificador: number;
  nome: string;
  quadra?: Quadra;
}

export interface CampoSelecionado extends Campo {
  quantidade: number;

}