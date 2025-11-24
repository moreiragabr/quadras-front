import { Horario } from "./horario";
import { Quadra } from "./quadra";
import { Reserva } from "./reserva";
import { Time } from "./time";

export class User {
    id!: number;
    nome!: string;
    email!: string;
    role!: string;
    reservas?: Reserva[];
    quadras?: Quadra[];
}
