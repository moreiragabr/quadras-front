import { afterNextRender, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { UserService } from '../../../../core/service/userService/user-service';
import { User } from '../../../../core/models/user';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { TimeService } from '../../../../core/service/timeService/time-service';
import { QuadraService } from '../../../../core/service/quadraService/quadra-service';
import { Time } from '../../../../core/models/time';
import { Quadra } from '../../../../core/models/quadra';

@Component({
  selector: 'app-usuarios-list-admin',
  imports: [FormsModule],
  templateUrl: './usuarios-list-admin.html',
  styleUrl: './usuarios-list-admin.scss'
})
export class UsuariosListAdmin {

  userService = inject(UserService);
  timeService = inject(TimeService);
  quadraService = inject(QuadraService);

  listaUsuarios?: User[];
  quadras!: Quadra[];

  selectedUser: User = {
    id: 1,
    nome: '',
    email: '',
    role: '',
    reservas: [],
    quadras: []
  };

  listaTimes!: Time[];

  editedUser: any = {
    nome: '',
    email: '',
    role: '',
    reservas: [],
    quadras: []
  };

  newUser = {
    nome: '',
    email: '',
    tipoUsuario: '',
    senha: '',
  };

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (dados) => {
        this.listaUsuarios = dados;
      },
      error: (erro) => {
        // Se ocorrer um erro na requisição, ele é capturado aqui
        console.error('Erro ao carregar os dados:', erro);
      }
    })
  }

  @ViewChild('modalRef') modalElement!: ElementRef;
  @ViewChild('modalRefNewUser') modalElementNewUser!: ElementRef;
  @ViewChild('ModalRefEditUser') modalElementEditUser!: ElementRef;

  openModal(user: User) {
    this.selectedUser = user;

    const modal = new (window as any).bootstrap.Modal(this.modalElement.nativeElement);
    modal.show();
  }


  openModalNewUser() {
    const modal = new (window as any).bootstrap.Modal(this.modalElementNewUser.nativeElement);
    modal.show();
  }


  openModalEditUser(user: User) {
    this.closeModal();
    this.editedUser = { ...user };
    this.editedUser.senha = null;
    const modal = new (window as any).bootstrap.Modal(this.modalElementEditUser.nativeElement);
    modal.show();
  }


  closeModal() {
    const modal = (window as any).bootstrap.Modal.getInstance(this.modalElement.nativeElement);
    if (modal) {
      modal.hide();
    }
  }


  closeModalNewUser() {
    const modal = (window as any).bootstrap.Modal.getInstance(this.modalElementNewUser.nativeElement);
    if (modal) {
      modal.hide();
    }
  }


  closeModalEditUser(openModal?: boolean) {
    const modal = (window as any).bootstrap.Modal.getInstance(this.modalElementEditUser.nativeElement);
    if (modal) {
      modal.hide();
    }
    if (openModal) {
      this.openModal(this.selectedUser);
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


  saveUser(newUser: any) {
    this.userService.save(newUser).subscribe({
      next: (dados) => {
        Swal.fire({
          title: "Usuário cadastrado com sucesso!",
          icon: 'success',
        })
        this.ngOnInit();
        this.closeModalNewUser();
      },
      error: (erro) => {
        Swal.fire({
          title: erro.status,
          text: "Usuário não cadastrado!",
          icon: 'error',
        })
        this.closeModalNewUser();
      }
    })
  }


  delete(idUser: number) {
    Swal.fire({
      title: "Deseja deletar este usuário?",
      text: "Será excluído os times e quadras que este usuário tem cadastrado!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim",
      cancelButtonText: "Não"
    }).then((result) => {
      if (result.isConfirmed) {

        this.userService.delete(idUser).subscribe({
          next: (dados) => {
            Swal.fire({
              title: "Usuário deletado com sucesso!",
              icon: 'success',
            })
            this.ngOnInit();
            this.closeModal();
          },

          error: (erro) => {
            Swal.fire({
              title: erro.status,
              text: "Usuário não deletado!",
              icon: 'error',
            })
          }
        })
      }
    });
  }


  edit(id: number, user: any) {
    Swal.fire({
      title: "Salvar as mudanças?",
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: "Sim",
      denyButtonText: "Não"
    }).then((result) => {
      if (result.isConfirmed) {

        this.userService.update(id, user).subscribe({
          next: (dados) => {
            console.log(user);
            Swal.fire({
              title: "Usuário atualizado com sucesso!",
              icon: 'success',
            })
            this.ngOnInit();
            this.closeModalEditUser(false);
          },

          error: (erro) => {
            Swal.fire({
              title: erro.status,
              text: "Usuário não atualizado!",
              icon: 'error',
            })
          }
        })
      }
    });
  }

  removerTimePresidido(id: number) {
    Swal.fire({
      title: "Deseja deletar este time?",
      text: "Se remover este time, ele será excluído!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim",
      cancelButtonText: "Não"
    }).then((result) => {
      if (result.isConfirmed) {

        this.timeService.delete(id).subscribe({
          next: (dados) => {
            Swal.fire({
              title: "Time deletado com sucesso!",
              icon: 'success',
            })
            this.ngOnInit();
            this.closeModalEditUser(false);
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

  removerTimeJogador(idUser: number, idTeam: number) {
    Swal.fire({
      title: "Deseja remover este time?",
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
              title: "Time removido com sucesso!",
              icon: 'success',
            })
            this.ngOnInit();
            this.closeModalEditUser(false);
          },

          error: (erro) => {
            Swal.fire({
              title: erro.status,
              text: "Time não removido!",
              icon: 'error',
            })
          }
        })
      }
    });

  }

  removerQuadra(idQuadra: number) {
    Swal.fire({
      title: "Deseja deletar esta quadra?",
      text: "Se deletar esta quadra, ela será excluída!",
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
              title: "Quadra removida com sucesso!",
              icon: 'success',
            })
            this.ngOnInit();
            this.closeModalEditUser(false);
          },

          error: (erro) => {
            Swal.fire({
              title: erro.status,
              text: "Quadra não removida!",
              icon: 'error',
            })
          }
        })
      }
    });

  }


  openSwalModal(id: number, type: string) {

    if (type == "timesPresididos" || type == "timesJogados") {
      this.timeService.getAll().subscribe({
        next: (dados) => {
          this.listaTimes = dados

          const opcoesTimes = this.converterListaParaInputOptions(this.listaTimes);

          Swal.fire({
            title: "Selecione o time",
            input: "select",
            // Usa o objeto de opções recém-criado
            inputOptions: opcoesTimes,
            inputPlaceholder: "Selecione um time...",
            showCancelButton: true,

            // 4. Capturar o Time Selecionado (Passo 3)
            preConfirm: (timeIdSelecionado) => {
              return this.encontrarTimeSelecionado(this.listaTimes, timeIdSelecionado);
            }
          })
            // O then é executado após o usuário confirmar a seleção
            .then((resultado) => {
              if (resultado.isConfirmed && resultado.value) {
                const timeSelecionado = resultado.value;
                console.log("Time Selecionado:", timeSelecionado);
                if (type == "timesPresididos") {
                  this.userService.adicionarTimeProprietario(id, timeSelecionado.id).subscribe({
                    next: (dados) => {
                      Swal.fire({
                        title: "Time adicionado com sucesso!",
                        icon: 'success',
                      })
                      this.ngOnInit();
                      this.closeModalEditUser(false);
                    },

                    error: (erro) => {
                      Swal.fire({
                        title: erro.status,
                        text: "Time não adicionado!",
                        icon: 'error',
                      })
                    }
                  })
                }
                if (type == "timesJogados") {
                  this.userService.adicionarTimeJogador(id, timeSelecionado.id).subscribe({
                    next: (dados) => {
                      Swal.fire({
                        title: "Time adicionado com sucesso!",
                        icon: 'success',
                      })
                      this.ngOnInit();
                      this.closeModalEditUser(false);
                    },

                    error: (erro) => {
                      Swal.fire({
                        title: erro.status,
                        text: "Time não adicionado!",
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

    if (type == "quadras") {
      this.quadraService.findAll().subscribe({
        next: (dados) => {
          this.quadras = dados

          const opcoesTimes = this.converterListaParaInputOptions(this.quadras);

          Swal.fire({
            title: "Selecione a quadra",
            input: "select",
            // Usa o objeto de opções recém-criado
            inputOptions: opcoesTimes,
            inputPlaceholder: "Selecione uma quadra...",
            showCancelButton: true,
            // 4. Capturar o Time Selecionado (Passo 3)
            preConfirm: (quadraId) => {
              return this.encontrarQuadraSelecionada(this.quadras, quadraId);
            }
          })
            // O then é executado após o usuário confirmar a seleção
            .then((resultado) => {
              if (resultado.isConfirmed && resultado.value) {
                const quadraSelecionada = resultado.value;
                console.log("Quadra selecionada:", quadraSelecionada);

                this.userService.adicionarQuadraProprietario(id, quadraSelecionada.id).subscribe({
                  next: (dados) => {
                    Swal.fire({
                      title: "Quadra adicionada com sucesso!",
                      icon: 'success',
                    })
                    this.ngOnInit();
                    this.closeModalEditUser(false);
                  },

                  error: (erro) => {
                    Swal.fire({
                      title: erro.status,
                      text: "Quadra não adicionada!",
                      icon: 'error',
                    })
                  }
                })
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

  encontrarTimeSelecionado(listaTimes: Time[], timeIdSelecionado: string): any | null {
    // Busca o objeto completo na lista que você acabou de carregar
    const timeEncontrado = listaTimes.find(time => time.id.toString() === timeIdSelecionado);

    if (!timeEncontrado) {
      Swal.showValidationMessage(`Time com ID ${timeIdSelecionado} não encontrado.`);
      return null; // Retorna null para manter o modal aberto e mostrar a validação
    }

    return timeEncontrado; // Retorna o objeto completo
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
