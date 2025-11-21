import { Component, inject } from '@angular/core';
import { AddressInputComponent } from "./endereco-seletor/endereco-seletor";
import { QuadraRegistrationService } from '../../../../core/service/quadraRegistrationService/quadra-registration-service';
import { Router } from '@angular/router';
import { LatLon, LocationService } from '../../../../core/service/locationIqService/location-iq-service';
import { FormsModule } from '@angular/forms';
import { OperatingHoursComponent } from './horario-funcionamento/horario-funcionamento';
import { QuadraService } from '../../../../core/service/quadraService/quadra-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-quadras-add-2',
  imports: [AddressInputComponent, FormsModule, OperatingHoursComponent],
  templateUrl: './quadras-add-2.html',
  styleUrl: './quadras-add-2.scss'
})
export class QuadrasAdd2 {

  locationIqService = inject(LocationService);
  stateService = inject(QuadraRegistrationService);
  router = inject(Router);
  quadraService = inject(QuadraService);

  addressData: any = {};
  latLon?: LatLon;
  horariosFuncionamento?: any[];

  onAddressReceived(data: any) {
    this.addressData = data;
  }

  onSchedulesReceived(schedulesData: any[]) {
    this.horariosFuncionamento = schedulesData;
    console.log('Dados de Horários recebidos no Componente Pai (X):', schedulesData);
  }

  nextStep() {

    this.locationIqService.geocodeAddress(
      this.addressData.rua,
      this.addressData.numeroCasa,
      this.addressData.bairro,
      this.addressData.cidade
    ).subscribe({
      next: (coords: LatLon | null) => {
        if (coords) {
          console.log('Coordenadas Encontradas:', coords);

          const partialData = {
            estado: this.addressData.estado,
            cidade: this.addressData.cidade,
            bairro: this.addressData.bairro,
            rua: this.addressData.rua,
            numeroCasa: this.addressData.numeroCasa,
            lot: coords.lon.toString(),
            lat: coords.lat.toString(),
            valorHora: this.addressData.valorHora,
            horariosDeFuncionamento: this.horariosFuncionamento
          };

          this.stateService.updateState(partialData);

          console.log(this.stateService.getState())

          this.quadraService.save(this.stateService.getState()).subscribe({
            next: (dados) => {
              Swal.fire({
                title: "Quadra cadastrada com sucesso!",
                icon: 'success',
              })
              
              this.router.navigate(['/quadras', dados.id]);
            },
            error: (erro) => {
              Swal.fire({
                title: erro.status,
                text: "Quadra não cadastrada!",
                icon: 'error',
              })
            }
          })


        } else {
          alert('Não foi possível geocodificar o endereço. Tente novamente ou ajuste o endereço.');
        }
      },
      error: (err) => {
        console.error('Erro na API LocationIQ:', err);
        alert('Erro ao comunicar com o serviço de mapas.');
      }
    });



    // this.router.navigate(['/cadastro/horarios']);
  }
}
