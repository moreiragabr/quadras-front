import { Component, inject } from '@angular/core';
import { QuadraService } from '../../../core/service/quadraService/quadra-service';
import { Quadra } from '../../../core/models/quadra';
import { CapitalizePipe } from '../../../shared/pipes/capitalize-pipe';

@Component({
  selector: 'app-quadras-list',
  imports: [CapitalizePipe],
  templateUrl: './quadras-list.html',
  styleUrl: './quadras-list.scss'
})
export class QuadrasList {
  quadraService = inject(QuadraService);

  quadras!: Quadra[];

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

}
