import { Horario } from "./horario";
import { User } from "./user";

export class Quadra{
    id!:number;
    nome?:string;
    // nota?:string;
    valorHora?:number;
    descricao?:string;
    partidaGravavel?:boolean;
    localizacao?:string;
    cidade?:string;
    estado?:string;
    bairro?:string;
    tipoQuadra?:string;
    horarios?:Horario[];
    proprietario?:User;
}