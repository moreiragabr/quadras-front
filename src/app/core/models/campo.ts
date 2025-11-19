export interface Campo {
  id: number;
  nome: string;
}

export interface CampoSelecionado extends Campo {
  quantidade: number;
}