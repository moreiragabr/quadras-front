import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/service/authService/auth-service';
import { Router } from '@angular/router';
import { RegisterRequest } from '../../../core/models/registerRequest';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { AddressInputComponent } from "./endereco-seletor/endereco-seletor";
import { LoginRequest } from '../../../core/models/loginRequest';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, AddressInputComponent],
  templateUrl: './registro.html',
  styleUrl: './registro.scss'
})
export class Registro {
  authService = inject(AuthService);
  router = inject(Router);

  registerRequest: RegisterRequest = {
    nome: '',
    email: '',
    senha: '',
    cidade: '',
    estado: '',
    bairro: '',
    rua: '',
    numeroCasa: '',
    cep: ''
  };

  loginRequest: LoginRequest = {
    email: '',
    senha: ''
  }

  errorMessage: string | null = null;

  addressData: any = {};

  onAddressReceived(data: any) {
    this.addressData = data;
  }

  registrar() {

    if (!this.registerRequest.nome || !this.registerRequest.email || !this.registerRequest.senha || !this.addressData) {
      Swal.fire({
        title: 'Insira todos os dados!',
        icon: 'warning',
      });
      return;
    }

    this.registerRequest.cidade = this.addressData.cidade;
    this.registerRequest.bairro = this.addressData.bairro;
    this.registerRequest.estado = this.addressData.estado;
    this.registerRequest.numeroCasa = this.addressData.numeroCasa;
    this.registerRequest.rua = this.addressData.rua;
    this.registerRequest.cep = this.addressData.cep;

    console.log(this.registerRequest)

    this.authService.register(this.registerRequest).subscribe({

      next: (response) => {
        Swal.fire({
          title: 'Cadastro completo!',
          icon: 'success'
        });

        this.loginRequest.email = this.registerRequest.email;
        this.loginRequest.senha = this.registerRequest.senha;

        this.authService.login(this.loginRequest).subscribe({
          next: (response) => {
            this.router.navigate(['/home']);
          },
        })
      },

      error: (error: Error) => {
        const msg = error.message;
        Swal.fire({
          title: 'Falha no cadastro',
          text: msg || 'Ocorreu um erro desconhecido.',
          icon: 'error',
        });
        this.errorMessage = msg;
      }
    });
  }


}
