//Este archivo api.ts es el que se encarga de hacer las peticiones al backend
//es decir, aca se envian las peticiones al backend, osea que es como un puente entre el frontend y el backend
//es decir, aca se maneja todo lo que tiene que ver con las peticiones al backend
//que viene desde el frontend, del archivo login.tsx y se envia al backend

import axios from 'axios'

// Qué es esto realmente

// Este archivo es como un teléfono rojo directo al backend 📞

// axios.create crea una instancia

// baseURL define dónde vive el backend

// 👉 Desde ahora:

// Todo request sale desde acá

// Nadie más escribe URLs

// 🧠 Por qué esto es tan importante

// Imaginá que mañana:

// el backend cambia de puerto

// pasa a producción

// se mueve a la nube

// Si no tenés esto:

// tendrías que cambiar 20 archivos

// Con esto:

// cambiás una sola línea

// Esto es arquitectura limpia, no moda.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // 👈 ESTO ES OBLIGATORIO para enviar cookies
})
