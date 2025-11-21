import { Component, inject } from '@angular/core';
import { AddressInputComponent } from "./endereco-seletor/endereco-seletor";
import { QuadraRegistrationService } from '../../../../core/service/quadraRegistrationService/quadra-registration-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quadras-add-2',
  imports: [AddressInputComponent],
  templateUrl: './quadras-add-2.html',
  styleUrl: './quadras-add-2.scss'
})
export class QuadrasAdd2 {

  stateService = inject(QuadraRegistrationService);
  router = inject(Router);

  addressData: any = {}; 

  onAddressReceived(data: any) {
    this.addressData = data;
  }

  nextStep() {
    const partialData = {
      estado: this.addressData.estado,
      cidade: this.addressData.cidade,
      bairro: this.addressData.bairro,
      rua: this.addressData.rua,
      numeroCasa: this.addressData.numeroCasa, 
    };
    
    this.stateService.updateState(partialData);

    console.log(this.stateService.getState())

    // this.router.navigate(['/cadastro/horarios']);
  }
}
