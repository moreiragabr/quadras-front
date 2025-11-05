import { Horario } from "./horario";
import { Quadra } from "./quadra";
import { Time } from "./time";
import { User } from "./user";

export class Reserva{
    id?:number;
    descricao?:string;
    horario?:Horario;
    times?:Time[];
    usuariosCadastrados?:User[];
    quadra?:Quadra;
}