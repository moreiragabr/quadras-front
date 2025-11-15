import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuadraService } from '../../../core/service/quadraService/quadra-service';
import { Quadra } from '../../../core/models/quadra';
import { CapitalizePipe } from '../../../shared/pipes/capitalize-pipe';

@Component({
  selector: 'app-quadras-detail',
  imports: [CapitalizePipe],
  templateUrl: './quadras-detail.html',
  styleUrl: './quadras-detail.scss'
})
export class QuadrasDetail implements OnInit{

  quadraService = inject(QuadraService);

  quadraId!: number;

  quadraEscolhida!: Quadra;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    console.log("a")
    this.quadraId = Number(this.route.snapshot.paramMap.get('id'));
    
      this.quadraService.findById(this.quadraId).subscribe({
      next: (dados) => {
        this.quadraEscolhida = dados;
        console.log(this.quadraEscolhida);
      },
      error: (erro) => {
        this.router.navigate(['/']);
        console.log(erro);
      }
    })
  }


}
