import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { UserService } from '../../../../core/service/userService/user-service';
import { TimeService } from '../../../../core/service/timeService/time-service';
import { QuadraService } from '../../../../core/service/quadraService/quadra-service';
import { User } from '../../../../core/models/user';
import { Quadra } from '../../../../core/models/quadra';
import { Time } from '../../../../core/models/time';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-times-list-admin',
  imports: [FormsModule],
  templateUrl: './times-list-admin.html',
  styleUrl: './times-list-admin.scss'
})
export class TimesListAdmin {

  userService = inject(UserService);
  timeService = inject(TimeService);
  quadraService = inject(QuadraService);

  listaUsuarios!: User[];
  quadras!: Quadra[];

  selectedTime: Time = {
    id: 1,
    nome: '',
    horarios: [],
    tipoEsporte: '',
    jogadores: [],
    reservas: [],
  };

  listaTimes!: Time[];

  editedTime: any = {
    nome: '',
    horarios: [],
    tipoEsporte: '',
    presidente:User,
    jogadores: [],
    reservas: [],
  };

  newTime = {
    nome: '',
    tipoEsporte: '',
    presidente:User,
  };

  ngOnInit(): void {
    this.timeService.getAll().subscribe({
      next: (dados) => {
        this.listaTimes = dados;
      },
      error: (erro) => {
        // Se ocorrer um erro na requisição, ele é capturado aqui
        console.error('Erro ao carregar os dados:', erro);
      }
    })
  }

  @ViewChild('modalRef') modalElement!: ElementRef;
  @ViewChild('modalRefNewTime') modalElementNewTime!: ElementRef;
  @ViewChild('ModalRefEditTime') modalElementEditTime!: ElementRef;

  openModal(time: Time) {
    this.selectedTime = time;
    const modal = new (window as any).bootstrap.Modal(this.modalElement.nativeElement);
    modal.show();
  }


  openModalNewTime() {
    this.userService.getUsers().subscribe({
      next: (dados) => {
        this.listaUsuarios = dados;
      },
      error: (erro) => {
        // Se ocorrer um erro na requisição, ele é capturado aqui
        console.error('Erro ao carregar os dados:', erro);
      }
    })

    const modal = new (window as any).bootstrap.Modal(this.modalElementNewTime.nativeElement);
    modal.show();
  }


  openModalEditTime(time: Time) {
    this.closeModal();
    this.editedTime = { ...time };
    const modal = new (window as any).bootstrap.Modal(this.modalElementEditTime.nativeElement);
    modal.show();
  }


  closeModal() {
    const modal = (window as any).bootstrap.Modal.getInstance(this.modalElement.nativeElement);
    if (modal) {
      modal.hide();
    }
  }


  closeModalNewTime() {
    const modal = (window as any).bootstrap.Modal.getInstance(this.modalElementNewTime.nativeElement);
    if (modal) {
      modal.hide();
    }
  }


  closeModalEditTime(openModal?: boolean) {
    const modal = (window as any).bootstrap.Modal.getInstance(this.modalElementEditTime.nativeElement);
    if (modal) {
      modal.hide();
    }
    if (openModal) {
      this.openModal(this.selectedTime);
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


  saveTime(newTime: any) {
    console.log(newTime)
    this.timeService.save(newTime).subscribe({
      next: (dados) => {
        Swal.fire({
          title: "Time cadastrado com sucesso!",
          icon: 'success',
        })
        this.ngOnInit();
        this.closeModalNewTime();
      },
      error: (erro) => {
        Swal.fire({
          title: erro.status,
          text: "Time não cadastrado!",
          icon: 'error',
        })
        this.closeModalNewTime();
      }
    })
  }


  delete(idTime: number) {
    Swal.fire({
      title: "Deseja deletar este time?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim",
      cancelButtonText: "Não"
    }).then((result) => {
      if (result.isConfirmed) {

        this.timeService.delete(idTime).subscribe({
          next: (dados) => {
            Swal.fire({
              title: "Time deletado com sucesso!",
              icon: 'success',
            })
            this.ngOnInit();
            this.closeModal();
          },

          error: (erro) => {
            Swal.fire({
              title: erro.status,
              text: "Time não deletado!",
              icon: 'error',
            })
          }
        })
      }
    });
  }


  edit(id: number, time: any) {

    Swal.fire({
      title: "Salvar as mudanças?",
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: "Sim",
      denyButtonText: "Não"
    }).then((result) => {
      if (result.isConfirmed) {

        this.timeService.update(id, time).subscribe({
          next: (dados) => {
            Swal.fire({
              title: "Time atualizado com sucesso!",
              icon: 'success',
            })
            this.ngOnInit();
            this.closeModalEditTime(false);
          },

          error: (erro) => {
            Swal.fire({
              title: erro.status,
              text: "Time não atualizado!",
              icon: 'error',
            })
          }
        })
      }
    });
  }


  removerTimeJogador(idUser: number, idTeam: number) {
    Swal.fire({
      title: "Deseja remover este jogador?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim",
      cancelButtonText: "Não"
    }).then((result) => {
      if (result.isConfirmed) {

        this.userService.removerTimeJogador(idUser, idTeam).subscribe({
          next: (dados) => {
            Swal.fire({
              title: "Jogador removido com sucesso!",
              icon: 'success',
            })
            this.ngOnInit();
            this.closeModalEditTime(false);
          },

          error: (erro) => {
            Swal.fire({
              title: erro.status,
              text: "Jogador não removido!",
              icon: 'error',
            })
          }
        })
      }
    });

  }

  openSwalModal(id: number, type: string) {

    if (type == "presidente" || type == "jogador") {
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

                if(type=="presidente"){
                this.userService.adicionarTimeProprietario(usuarioSelecionado.id, id).subscribe({
                  next: (dados) => {
                    Swal.fire({
                      title: "Presidente alterado com sucesso!",
                      icon: 'success',
                    })
                    this.ngOnInit();
                    this.closeModalEditTime(false);
                  },

                  error: (erro) => {
                    Swal.fire({
                      title: erro.status,
                      text: "Presidente não alterado!",
                      icon: 'error',
                    })
                  }
                })
              }

                if (type == "jogador") {
                  this.userService.adicionarTimeJogador(usuarioSelecionado.id, id).subscribe({
                    next: (dados) => {
                      Swal.fire({
                        title: "Jogador adicionado com sucesso!",
                        icon: 'success',
                      })
                      this.ngOnInit();
                      this.closeModalEditTime(false);
                    },

                    error: (erro) => {
                      Swal.fire({
                        title: erro.status,
                        text: "Jogador não adicionado!",
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

  encontrarQuadraSelecionada(quadras: Quadra[], quadraIdSelecionado: string): any | null {
    // Busca o objeto completo na lista que você acabou de carregar
    const quadraEncontrada = quadras.find(quadra => quadra.id.toString() === quadraIdSelecionado);

    if (!quadraEncontrada) {
      Swal.showValidationMessage(`Quadra com ID ${quadraIdSelecionado} não encontrada.`);
      return null; // Retorna null para manter o modal aberto e mostrar a validação
    }

    return quadraEncontrada; // Retorna o objeto completo
  }
}
