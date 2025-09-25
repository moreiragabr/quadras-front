import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { UserService } from '../../../../core/service/userService/user-service';
import { TimeService } from '../../../../core/service/timeService/time-service';
import { QuadraService } from '../../../../core/service/quadraService/quadra-service';
import { User } from '../../../../core/models/user';
import { Quadra } from '../../../../core/models/quadra';
import { Time } from '../../../../core/models/time';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { Horario } from '../../../../core/models/horario';
import { HorarioService } from '../../../../core/service/horarioService/horario-service';

@Component({
  selector: 'app-quadras-list-admin',
  imports: [FormsModule],
  templateUrl: './quadras-list-admin.html',
  styleUrl: './quadras-list-admin.scss'
})
export class QuadrasListAdmin {

  userService = inject(UserService);
  timeService = inject(TimeService);
  quadraService = inject(QuadraService);
  horarioService = inject(HorarioService);

  listaUsuarios!: User[];
  quadras!: Quadra[];

  selectedQuadra: Quadra = {
    id: 1,
    nome: '',
    valorHora: 0,
    partidaGravavel: false,
    localizacao: '',
    tipoQuadra: '',
    horarios: [],
  };

  listaTimes!: Time[];

  editedQuadra: any = {
    nome: '',
    tipoQuadra: '',
    proprietario: User,
    valorHora: 0,
    partidaGravavel: false,
    horarios: [],
    localizacao: ''
  };

  newQuadra = {
    nome: '',
    tipoQuadra: '',
    proprietario: User,
    valorHora: 0,
    partidaGravavel: false,
    localizacao: ''
  };

  ngOnInit(): void {
    this.quadraService.findAll().subscribe({
      next: (dados) => {
        this.quadras = dados;
      },
      error: (erro) => {
        // Se ocorrer um erro na requisição, ele é capturado aqui
        console.error('Erro ao carregar os dados:', erro);
      }
    })
  }

  @ViewChild('modalRef') modalElement!: ElementRef;
  @ViewChild('modalRefNewQuadra') modalElementNewQuadra!: ElementRef;
  @ViewChild('ModalRefEditQuadra') modalElementEditQuadra!: ElementRef;

  openModal(quadra: Quadra) {
    this.selectedQuadra = quadra;
    const modal = new (window as any).bootstrap.Modal(this.modalElement.nativeElement);
    modal.show();
  }


  openModalNewQuadra() {
    this.userService.getUsers().subscribe({
      next: (dados) => {
        this.listaUsuarios = dados;
      },
      error: (erro) => {
        // Se ocorrer um erro na requisição, ele é capturado aqui
        console.error('Erro ao carregar os dados:', erro);
      }
    })

    const modal = new (window as any).bootstrap.Modal(this.modalElementNewQuadra.nativeElement);
    modal.show();
  }


  openModalEditQuadra(quadra: Quadra) {
    this.closeModal();
    this.editedQuadra = { ...quadra };
    const modal = new (window as any).bootstrap.Modal(this.modalElementEditQuadra.nativeElement);
    modal.show();
  }


  closeModal() {
    const modal = (window as any).bootstrap.Modal.getInstance(this.modalElement.nativeElement);
    if (modal) {
      modal.hide();
    }
  }


  closeModalNewQuadra() {
    const modal = (window as any).bootstrap.Modal.getInstance(this.modalElementNewQuadra.nativeElement);
    if (modal) {
      modal.hide();
    }
  }


  closeModalEditQuadra(openModal?: boolean) {
    const modal = (window as any).bootstrap.Modal.getInstance(this.modalElementEditQuadra.nativeElement);
    if (modal) {
      modal.hide();
    }
    if (openModal) {
      this.openModal(this.selectedQuadra);
    }
  }


  saveChanges(idUser: number, userEdited: User) {

    console.log(idUser)
    console.log(userEdited)
    this.userService.update(idUser, userEdited).subscribe({
      next: (dados) => {
        Swal.fire({
          title: "Salvo com sucesso!",
          icon: 'success',
        })
        this.ngOnInit();
        this.closeModal();
        this.openModal(userEdited);
      },
      error: (erro) => {
        Swal.fire({
          title: erro.status,
          text: "Objeto não salvo!",
          icon: 'error',
        })
        this.closeModal();
      }
    })
  }


  saveQuadra(newQuadra: any) {
    console.log(newQuadra)
    this.quadraService.save(newQuadra).subscribe({
      next: (dados) => {
        Swal.fire({
          title: "Quadra cadastrada com sucesso!",
          icon: 'success',
        })
        this.ngOnInit();
        this.closeModalNewQuadra();
      },
      error: (erro) => {
        Swal.fire({
          title: erro.status,
          text: "Quadra não cadastrada!",
          icon: 'error',
        })
        this.closeModalNewQuadra();
      }
    })
  }


  delete(idQuadra: number) {
    Swal.fire({
      title: "Deseja deletar esta quadra?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim",
      cancelButtonText: "Não"
    }).then((result) => {
      if (result.isConfirmed) {

        this.quadraService.delete(idQuadra).subscribe({
          next: (dados) => {
            Swal.fire({
              title: "Quadra deletada com sucesso!",
              icon: 'success',
            })
            this.ngOnInit();
            this.closeModal();
          },

          error: (erro) => {
            Swal.fire({
              title: erro.status,
              text: "Quadra não deletada!",
              icon: 'error',
            })
          }
        })
      }
    });
  }


  edit(id: number, quadra: any) {

    Swal.fire({
      title: "Salvar as mudanças?",
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: "Sim",
      denyButtonText: "Não"
    }).then((result) => {
      if (result.isConfirmed) {

        this.quadraService.update(id, quadra).subscribe({
          next: (dados) => {
            Swal.fire({
              title: "Quadra atualizada com sucesso!",
              icon: 'success',
            })
            this.ngOnInit();
            this.closeModalEditQuadra(false);
          },

          error: (erro) => {
            Swal.fire({
              title: erro.status,
              text: "Quadra não atualizada!",
              icon: 'error',
            })
          }
        })
      }
    });
  }


  removerHorario(id: number) {

    Swal.fire({
      title: "Deseja remover este horário?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim",
      cancelButtonText: "Não"
    }).then((result) => {
      if (result.isConfirmed) {

        this.horarioService.delete(id).subscribe({
          next: (dados) => {
            Swal.fire({
              title: "Horario removido com sucesso!",
              icon: 'success',
            })
            this.ngOnInit();
            this.closeModalEditQuadra(false);
          },

          error: (erro) => {
            Swal.fire({
              title: erro.status,
              text: "Horario não removido!",
              icon: 'error',
            })
          }
        })
      }
    });

  }

  openSwalModal(id: number, type: string) {

    if (type == "proprietario") {
      this.userService.getUsers().subscribe({
        next: (dados) => {
          this.listaUsuarios = dados

          const opcoesUsuarios = this.converterListaParaInputOptions(this.listaUsuarios);

          Swal.fire({
            title: "Selecione um usuario",
            input: "select",
            // Usa o objeto de opções recém-criado
            inputOptions: opcoesUsuarios,
            inputPlaceholder: "Selecione um usuario...",
            showCancelButton: true,

            // 4. Capturar o Time Selecionado (Passo 3)
            preConfirm: (usuarioIdSelecionado) => {
              return this.encontrarUsuarioSelecionado(this.listaUsuarios, usuarioIdSelecionado);
            }
          })
            // O then é executado após o usuário confirmar a seleção
            .then((resultado) => {
              if (resultado.isConfirmed && resultado.value) {
                const usuarioSelecionado = resultado.value;
                console.log("Usuario Selecionado:", usuarioSelecionado);

                if (type == "proprietario") {
                  this.userService.adicionarQuadraProprietario
                    (usuarioSelecionado.id, id).subscribe({
                      next: (dados) => {
                        Swal.fire({
                          title: "Proprietario alterado com sucesso!",
                          icon: 'success',
                        })
                        this.ngOnInit();
                        this.closeModalEditQuadra(false);
                      },

                      error: (erro) => {
                        Swal.fire({
                          title: erro.status,
                          text: "Proprietario não alterado!",
                          icon: 'error',
                        })
                      }
                    })
                }
              }
            });
        }
      })
    }
    if (type == "horario") {
      const horario = Swal.fire({
        title: "Selecione um horário",
        input: "select",
        inputOptions: {
          '01:00':'01:00',
          '02:00':'02:00',
          '03:00':'03:00',
          '04:00':'04:00',
          '05:00':'05:00',
          '06:00':'06:00',
          '07:00':'07:00',
          '08:00':'08:00',
          '09:00':'09:00',
          '11:00':'11:00',
          '12:00':'12:00',
          '13:00':'13:00',
          '14:00':'14:00',
          '15:00':'15:00',
          '16:00':'16:00',
          '17:00':'17:00',
          '18:00':'18:00',
          '19:00':'19:00',
          '20:00':'20:00',
          '21:00':'21:00',
          '22:00':'22:00',
          '23:00':'23:00',
          '00:00':'00:00'
        },
      });
      if(horario!=null){
        
      }
    }
  }

  converterListaParaInputOptions(lista: any[]): { [key: string]: string } {
    const opcoes: { [key: string]: string } = {};

    lista.forEach(time => {
      // Usa o ID como chave (o valor que será retornado) e o Nome como texto
      opcoes[time.id.toString()] = time.nome;
    });

    return opcoes;
  }

  encontrarUsuarioSelecionado(listaUsuarios: User[], userIdSelecionado: string): any | null {
    // Busca o objeto completo na lista que você acabou de carregar
    const usuarioEncontrado = listaUsuarios.find(user => user.id.toString() === userIdSelecionado);

    if (!usuarioEncontrado) {
      Swal.showValidationMessage(`Time com ID ${userIdSelecionado} não encontrado.`);
      return null; // Retorna null para manter o modal aberto e mostrar a validação
    }

    return usuarioEncontrado; // Retorna o objeto completo
  }
}
