export interface Persona {
  id: number;
  dni: string;
  nombre: string;
  /** Fecha sin hora, guardada a medianoche UTC (convención de `<input type="date">`). */
  fechaNacimiento: Date;
}

export type PersonaInput = Omit<Persona, 'id'>;

/**
 * Modelo que usa el formulario. La fecha es nullable porque `<input type="date">`
 * trabaja con `Date` y arranca vacío hasta que el usuario elige una fecha.
 */
export interface PersonaFormModel {
  dni: string;
  nombre: string;
  fechaNacimiento: Date | null;
}
