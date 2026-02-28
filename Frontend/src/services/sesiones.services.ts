import { api } from './api';
import type { DashboardData } from '../types';

export const sesionesService = {
  // 📥 Obtener datos completos del usuario
  getDashboardData: async (): Promise<DashboardData & { error?: string }> => {
    const res = await api.get('/usuarios/dashboard');
    return res.data;
  },

  // 📝 Registrar un nuevo entrenamiento
  registrarEntrenamiento: async (id_rutina: number, ejercicios: { id_ejercicio: number, reps_realizadas: number, series_realizadas: number }[]): Promise<{ xpGanada: number }> => {
    const res = await api.post('/sesiones/registrar', {
      id_rutina,
      ejercicios
    });
    return res.data;
  }
};
