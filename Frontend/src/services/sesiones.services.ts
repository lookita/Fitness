import { api } from './api';

export const sesionesService = {
  // 🎯 Obtener todos los datos del dashboard (perfil, rutinas, progreso)
  async getDashboardData() {
    const response = await api.get('/usuarios/dashboard');
    return response.data;
  },

  // 📝 Registrar un nuevo entrenamiento
  async registrarEntrenamiento(id_rutina: number, ejercicios: { id_ejercicio: number, reps_realizadas: number }[]) {
    const response = await api.post('/sesiones/registrar', {
      id_rutina,
      ejercicios,
    });
    return response.data;
  }
};

