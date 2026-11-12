import { Component, computed, inject, signal } from '@angular/core';
import {
  FormField,
  FormRoot,
  form,
  maxDate,
  maxLength,
  minDate,
  minLength,
  pattern,
  required,
  validate,
} from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PersonaFormModel, PersonaInput } from '../../interfaces/persona.interface';
import { PersonaService } from '../../services/persona.service';

const PATRON_SOLO_LETRAS = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

@Component({
  selector: 'app-persona-form',
  imports: [FormRoot, FormField, RouterLink],
  templateUrl: './persona-form.html',
})
export class PersonaForm {
  private readonly personaService = inject(PersonaService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly idActual = signal<number | null>(null);
  readonly esEdicion = computed(() => this.idActual() !== null);

  readonly modelo = signal<PersonaFormModel>({
    dni: '',
    nombre: '',
    fechaNacimiento: null,
  });

  /** Medianoche UTC de hoy, como recomienda la guía para comparar fechas de `<input type="date">`. */
  private readonly hoyUTC = (() => {
    const ahora = new Date();
    return new Date(Date.UTC(ahora.getFullYear(), ahora.getMonth(), ahora.getDate()));
  })();

  readonly personaForm = form(
    this.modelo,
    (p) => {
      required(p.dni, { message: 'El DNI es obligatorio' });
      maxLength(p.dni, 8, { message: 'El DNI debe tener 8 dígitos' });
      pattern(p.dni, /^\d{8}$/, { message: 'El DNI debe tener 8 dígitos' });
      validate(p.dni, ({ value }) => {
        const dni = value();
        const duplicado =
          /^\d{8}$/.test(dni) && this.personaService.existeDni(dni, this.idActual() ?? undefined);

        return duplicado
          ? { kind: 'dniDuplicado', message: 'Ya existe una persona con ese DNI' }
          : undefined;
      });

      required(p.nombre, { message: 'El nombre es obligatorio' });
      minLength(p.nombre, 3, { message: 'El nombre debe tener al menos 3 caracteres' });
      maxLength(p.nombre, 100, { message: 'El nombre no puede superar los 100 caracteres' });
      pattern(p.nombre, PATRON_SOLO_LETRAS, {
        message: 'El nombre solo puede tener letras y espacios',
      });

      required(p.fechaNacimiento, { message: 'La fecha de nacimiento es obligatoria' });
      minDate(p.fechaNacimiento, new Date('1900-01-01'), { message: 'Fecha inválida' });
      maxDate(p.fechaNacimiento, this.hoyUTC, { message: 'La fecha no puede ser futura' });
    },
    {
      submission: {
        action: async () => {
          const valor = this.modelo();
          if (!valor.fechaNacimiento) {
            return;
          }

          const datos: PersonaInput = {
            dni: valor.dni,
            nombre: valor.nombre,
            fechaNacimiento: valor.fechaNacimiento,
          };

          const id = this.idActual();
          if (id === null) {
            this.personaService.crear(datos);
          } else {
            this.personaService.actualizar(id, datos);
          }

          await this.router.navigate(['/personas']);
        },
        onInvalid: (campo) => {
          campo().errorSummary()[0]?.fieldTree().focusBoundControl();
        },
      },
    },
  );

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(id) || id <= 0) {
      return;
    }

    const persona = this.personaService.getById(id);
    if (!persona) {
      void this.router.navigate(['/personas']);
      return;
    }

    this.idActual.set(id);
    this.modelo.set({
      dni: persona.dni,
      nombre: persona.nombre,
      fechaNacimiento: persona.fechaNacimiento,
    });
  }
}
