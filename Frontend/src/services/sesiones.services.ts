import { api } from './api';

export const sesionesService = {
  // 🎯 Obtener todos los datos del dashboard (perfil, rutinas, progreso)
  async getDashboardData() {
    try {
      const response = await api.get('/usuarios/dashboard');
      return response.data;
    } catch (err: any) {
      console.error('Error cargando dashboard desde sesionesService:', err);
      throw err;
    }
  },

  // 📝 Registrar un nuevo entrenamiento
  async registrarEntrenamiento(
    id_rutina: number,
    ejercicios: { id_ejercicio: number; reps_realizadas: number }[]
  ) {
    try {
      const response = await api.post('/sesiones/registrar', {
        id_rutina,
        ejercicios,
      });
      return response.data;
    } catch (err: any) {
      console.error('Error registrando entrenamiento:', err);
      throw err;
    }
  },
};
