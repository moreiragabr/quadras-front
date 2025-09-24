import { Time } from "./time";

export class User {
    id?: number;
    nome?: string;
    email?: string;
    senha?: string;
    tipoUsuario?: string;
    horarios?: Horario[];
    timesProprietarios?: Time[];
    reservas?: Reserva[];
    quadras?: Quadras[];
    // createdAt: date
    // updatedAt: date
    // isActive: boolean
}
