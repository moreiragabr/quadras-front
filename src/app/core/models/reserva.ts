import { Time } from "./time";
import { User } from "./user";

export class Reserva{
    id?:number;
    descricao?:string;
    horarios?:Horario[];
    times?:Time[];
    usuariosCadastrados?:User[];
    quadra?:Quadra;
}