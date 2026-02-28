// types/index.ts - Tipado Central del Proyecto

export interface Usuario {
  id_usuario: number;
  nombre: string;
  email: string;
}

export interface PerfilFisico {
  nivel: number;
  xp: number;
  edad?: number;
  peso?: number;
}

export interface Ejercicio {
  id_ejercicio: number;
  nombre: string;
  descripcion?: string;
  dificultad: 'facil' | 'medio' | 'dificil';
  nivel_requerido: number;
  fase: number;
  id_grupo?: number;
  grupo?: {
    id_grupo: number;
    nombre: string;
  };
}

export interface RutinaEjercicio {
  id_ejercicio: number;
  series: number;
  repeticiones: number;
  ejercicio: Ejercicio;
}

export interface Rutina {
  id_rutina: number;
  nombre: string;
  descripcion?: string;
  nivel_objetivo: number;
  fase_objetivo: number;
  rutina_ejercicios?: RutinaEjercicio[];
}

export interface ProgresoEjercicio {
  ejercicio: string;
  mejor_record: number;
  maestreado: boolean;
  fecha_maestria?: string;
}

export interface DashboardData {
  perfil: PerfilFisico;
  rutinas: Rutina[];
  progreso: ProgresoEjercicio[];
}
