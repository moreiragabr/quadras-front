import { Component, inject } from '@angular/core';
import { QuadraService } from '../../../core/service/quadraService/quadra-service';
import { Quadra } from '../../../core/models/quadra';
import { CapitalizePipe } from '../../../shared/pipes/capitalize-pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quadras-list',
  imports: [CapitalizePipe],
  templateUrl: './quadras-list.html',
  styleUrl: './quadras-list.scss'
})
export class QuadrasList {
  quadraService = inject(QuadraService);
  
  constructor(private router: Router) {}

  quadras!: Quadra[];

  verInformacoes(quadraId: number): void {
    this.router.navigate(['/quadras', quadraId]);
  }

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
