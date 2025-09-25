import { Horario } from "./horario";
import { User } from "./user";

export class Quadra{
    id?:number;
    nome?:string;
    // nota?:string;
    valorHora?:number;
    partidaGravavel?:boolean;
    localizacao?:string;
    tipoQuadra?:string;
    horarios?:Horario[];
    proprietario?:User;
}