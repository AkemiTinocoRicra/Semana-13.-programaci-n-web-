import { Injectable, signal } from '@angular/core';
import { Persona, PersonaInput } from '../interfaces/persona.interface';

@Injectable({ providedIn: 'root' })
export class PersonaService {
  private readonly _personas = signal<Persona[]>([]);
  readonly personas = this._personas.asReadonly();

  private nextId = 1;

  getAll(): Persona[] {
    return this._personas();
  }

  getById(id: number): Persona | undefined {
    return this._personas().find((persona) => persona.id === id);
  }

  crear(datos: PersonaInput): Persona {
    const persona: Persona = { id: this.nextId++, ...datos };
    this._personas.update((personas) => [...personas, persona]);
    return persona;
  }

  actualizar(id: number, datos: PersonaInput): boolean {
    if (!this.getById(id)) {
      return false;
    }
    this._personas.update((personas) =>
      personas.map((persona) => (persona.id === id ? { id, ...datos } : persona)),
    );
    return true;
  }

  eliminar(id: number): boolean {
    if (!this.getById(id)) {
      return false;
    }
    this._personas.update((personas) => personas.filter((persona) => persona.id !== id));
    return true;
  }

  existeDni(dni: string, idExcluir?: number): boolean {
    return this._personas().some((persona) => persona.dni === dni && persona.id !== idExcluir);
  }
}
