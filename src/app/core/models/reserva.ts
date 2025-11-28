import { Campo } from "./campo";
import { Horario } from "./horario";
import { Quadra } from "./quadra";
import { Time } from "./time";
import { User } from "./user";

export class Reserva{
  id?: number;
  inicioReserva?: string; 
  campo?: Campo;
}

    // @Id
    // @GeneratedValue(strategy = GenerationType.IDENTITY)
    // private Long id;

    // @Column(nullable = false)
    // private LocalDateTime inicioReserva;

    // @ManyToOne
    // @JoinColumn(name = "campo_id", nullable = false)
    // private Campo campo;

    // @ManyToOne
    // @JsonIgnoreProperties("reservas")
    // private Usuario usuario;