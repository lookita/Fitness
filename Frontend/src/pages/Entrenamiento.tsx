import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sesionesService } from '../services/sesiones.services';
import Boton from '../components/Boton';
import Header from '../components/Header';

const Entrenamiento: React.FC = () => {
  const [rutinas, setRutinas] = useState<any[]>([]);
  const [rutinaSeleccionada, setRutinaSeleccionada] = useState<any>(null);
  const [resultados, setResultados] = useState<Record<number, number>>({});
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const MOCK_RUTINAS = [
      { 
        id_rutina: 1, 
        nombre: 'Nivel 1 - Fase 1 - Rutina A',
        rutina_ejercicios: [
          { id_ejercicio: 1, ejercicio: { nombre: 'Flexiones de rodillas' } },
          { id_ejercicio: 4, ejercicio: { nombre: 'Plancha 20s' } }
        ]
      },
      { 
        id_rutina: 2, 
        nombre: 'Nivel 1 - Fase 1 - Rutina B',
        rutina_ejercicios: [
          { id_ejercicio: 2, ejercicio: { nombre: 'Sentadilla con peso corporal' } }
        ]
      }
    ];
    setRutinas(MOCK_RUTINAS);
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
      <div className="fade-in" style={{ padding: '100px 20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <Header />
      <h1 className="text-gradient">ELIGE TU DESAFÍO</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '3rem' }}>
          {rutinas.map(r => (
            <div key={r.id_rutina} className="glass stat-card" style={{ cursor: 'pointer', padding: '2rem' }} onClick={() => seleccionarRutina(r)}>
              <h3 style={{ color: 'var(--volt-yellow)' }}>{r.nombre}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{r.rutina_ejercicios.length} Ejercicios</p>
              <Boton style={{ marginTop: '1rem' }}>COMENZAR</Boton>
            </div>
          ))}
        </div>
        <Boton onClick={() => navigate('/dashboard')} style={{ marginTop: '3rem', background: 'transparent', border: '1px solid var(--metallic-grey)', color: 'white' }}>VOLVER AL DASHBOARD</Boton>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ padding: '100px 20px', maxWidth: '600px', margin: '0 auto' }}>
      <Header />
      <header className="glass" style={{ padding: '1.5rem', borderRadius: '20px', textAlign: 'center', marginBottom: '2rem' }}>
        <p style={{ margin: 0, color: 'var(--volt-yellow)', fontSize: '0.8rem', letterSpacing: '2px' }}>ENTRENANDO</p>
        <h2 style={{ margin: 0 }}>{rutinaSeleccionada.nombre}</h2>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {rutinaSeleccionada.rutina_ejercicios.map((re: any) => (
          <div key={re.id_ejercicio} className="glass" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: 0 }}>{re.ejercicio.nombre}</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Repeticiones máximas</p>
            </div>
            <input 
              type="number" 
              className="input-field"
              style={{ width: '80px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}
              placeholder="0"
              onChange={(e) => handleInputChange(re.id_ejercicio, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Boton onClick={guardarSesion}>FINALIZAR SESIÓN</Boton>
        <button onClick={() => setRutinaSeleccionada(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline' }}>Cancelar y volver</button>
      </div>

      {mensaje && (
        <div className="glass fade-in" style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', padding: '1rem 2rem', borderRadius: '50px', border: '1px solid var(--volt-yellow)' }}>
          <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--volt-yellow)' }}>{mensaje}</p>
        </div>
      )}
    </div>
  );
};

export default Entrenamiento;
