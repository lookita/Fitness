import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sesionesService } from '../services/sesiones.services';

const Entrenamiento: React.FC = () => {
  const [rutinas, setRutinas] = useState<any[]>([]);
  const [rutinaSeleccionada, setRutinaSeleccionada] = useState<any>(null);
  const [resultados, setResultados] = useState<Record<number, number>>({});
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const data = await sesionesService.getDashboardData();
      setRutinas(data.rutinas);
    };
    load();
  }, []);

  const seleccionarRutina = (r: any) => {
    setRutinaSeleccionada(r);
    const initial: Record<number, number> = {};
    r.rutina_ejercicios.forEach((re: any) => {
      initial[re.id_ejercicio] = 0;
    });
    setResultados(initial);
  };

  const handleInputChange = (id: number, val: string) => {
    setResultados({ ...resultados, [id]: parseInt(val) || 0 });
  };

  const guardarSesion = async () => {
    try {
      const ejerciciosParaEnviar = Object.entries(resultados).map(([id, reps]) => ({
        id_ejercicio: parseInt(id),
        reps_realizadas: reps
      }));

      const res = await sesionesService.registrarEntrenamiento(rutinaSeleccionada.id_rutina, ejerciciosParaEnviar);
      setMensaje(`Éxito: Ganaste ${res.xpGanada} XP.`);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      setMensaje("Error al guardar");
    }
  };

  if (!rutinaSeleccionada) {
    return (
      <div>
        <h2>Selecciona rutina</h2>
        {rutinas.map(r => (
          <button key={r.id_rutina} onClick={() => seleccionarRutina(r)}>{r.nombre}</button>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2>Entrenando: {rutinaSeleccionada.nombre}</h2>
      {rutinaSeleccionada.rutina_ejercicios.map((re: any) => (
        <div key={re.id_ejercicio}>
          <label>{re.ejercicio.nombre}</label>
          <input 
            type="number" 
            onChange={(e) => handleInputChange(re.id_ejercicio, e.target.value)}
          />
        </div>
      ))}
      <button onClick={guardarSesion}>Guardar</button>
      <p>{mensaje}</p>
      <button onClick={() => setRutinaSeleccionada(null)}>Atrás</button>
    </div>
  );
};

export default Entrenamiento;
