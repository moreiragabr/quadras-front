import { User } from "./user";

export class Time{
    id?:number;
    nome?:string;
    horarios?:Horario[];
    tipoEsporte?:string;
    presidente?:User;
    jogadores?:User[];
    reservas?:Reserva[];
}