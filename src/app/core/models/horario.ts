import { Quadra } from "./quadra";
import { Reserva } from "./reserva";
import { Time } from "./time";
import { User } from "./user";

export class Horario{
    id?:number;
    horario?:string;
    data?:string;
    quadra?:Quadra;
    timesCadastrados?:Time[];
    usuariosCadastrados?:User[];
    reserva?:Reserva;
}