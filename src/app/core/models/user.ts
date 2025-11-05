import { Horario } from "./horario";
import { Quadra } from "./quadra";
import { Reserva } from "./reserva";
import { Time } from "./time";

export class User {
    id!: number;
    nome?: string;
    email?: string;
    senha?: string;
    tipoUsuario?: string;
    horarios?: Horario[];
    timesProprietarios?: Time[];
    times?: Time[];
    reservas?: Reserva[];
    quadras?: Quadra[];
    // createdAt: date
    // updatedAt: date
    // isActive: boolean
}
