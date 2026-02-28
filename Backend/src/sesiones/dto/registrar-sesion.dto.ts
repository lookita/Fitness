// 📝 Este archivo define la estructura de datos que el usuario envía
// cuando registra una sesión de entrenamiento

export class RegistrarSesionDto {
  // ID de la rutina que está haciendo (ej: Rutina A, B o C)
  id_rutina: number;

  // Lista de ejercicios que hizo en esta sesión
  ejercicios: EjercicioRealizadoDto[];
}

// 📝 Estructura para cada ejercicio que el usuario hizo
export class EjercicioRealizadoDto {
  // ID del ejercicio (ej: Wall Push Ups)
  id_ejercicio: number;

  // Cuántas repeticiones logró hacer en cada serie
  reps_realizadas: number;

  // Cuántas series logró completar (máximo 4 según regla de negocio)
  series_realizadas: number;
}
