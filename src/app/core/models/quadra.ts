import { Campo } from "./campo";
import { Horario } from "./horario";
import { HorarioDia } from "./horarioDia";
import { User } from "./user";

export class Quadra {
    id!: number;
    nome?: string;
    // nota?:string;
    valorHora?: number;
    descricao?: string;
    partidaGravavel?: boolean;
    localizacao?: string;
    cidade?: string;
    estado?: string;
    bairro?: string;
    rua?: string;
    numeroCasa?: string;
    lot?: string;
    lat?: string;
    tipoQuadra?: string;
    horarios?: Horario[];
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