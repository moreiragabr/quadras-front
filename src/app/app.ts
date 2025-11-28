import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './features/layout/navbar/navbar';
import { AuthService } from './core/service/authService/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('quadras-fron');

  private authService = inject(AuthService);

  ngOnInit() {
    // 💥 CHAVE PARA QUEBRAR O CICLO DE DEPENDÊNCIA 💥
    // Garante que o serviço de autenticação seja construído e que os interceptors
    // estejam prontos ANTES da requisição HTTP ser disparada.
    this.authService.initializeSession();
  }
}
