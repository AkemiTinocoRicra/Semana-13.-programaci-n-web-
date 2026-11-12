import { Component, afterNextRender, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly title = signal('frontend');
  protected readonly auth = this.authService;

  /**
   * La sesión solo existe en el navegador. Hasta que termina la hidratación no
   * se pinta la zona de sesión, para que el HTML del servidor y el del cliente
   * coincidan.
   */
  protected readonly mostrarSesion = signal(false);

  constructor() {
    afterNextRender(() => this.mostrarSesion.set(true));
  }

  protected cerrarSesion(): void {
    this.authService.cerrarSesion();
    void this.router.navigate(['/login']);
  }
}
