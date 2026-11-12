import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Persona } from '../../interfaces/persona.interface';
import { PersonaService } from '../../services/persona.service';

@Component({
  selector: 'app-personas-list',
  imports: [RouterLink, DatePipe],
  templateUrl: './personas-list.html',
})
export class PersonasList {
  private readonly personaService = inject(PersonaService);

  readonly personas = this.personaService.personas;

  eliminar(persona: Persona): void {
    if (confirm(`¿Eliminar a ${persona.nombre} (DNI ${persona.dni})?`)) {
      this.personaService.eliminar(persona.id);
    }
  }
}
