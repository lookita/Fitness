// api.ts: puente entre frontend y backend
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,          // 👈 debe coincidir con el puerto real del backend
  withCredentials: true,     // 👈 necesario para enviar cookies de sesión
});
