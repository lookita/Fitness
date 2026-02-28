import { useState, useEffect, type FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { sesionesService } from '../services/sesiones.services';
import Boton from '../components/Boton';
import Header from '../components/Header';
import type { Rutina } from '../types';

const Entrenamiento: FC = () => {
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [rutinaSeleccionada, setRutinaSeleccionada] = useState<Rutina | null>(null);
  const [resultados, setResultados] = useState<Record<number, { reps: number, series: number, acumuladoReps: number }>>({});
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadRutinas = async () => {
      try {
        const data = await sesionesService.getDashboardData();
        const apiRutinas = data.rutinas || [];
        setRutinas(apiRutinas);

        if (location.state?.rutina) {
          seleccionarRutina(location.state.rutina);
        }
      } catch (err) {
        console.error("Error cargando rutinas:", err);
      }
    };
    loadRutinas();
  }, [location.state]);

  const seleccionarRutina = (r: Rutina) => {
    setRutinaSeleccionada(r);
    const initial: Record<number, { reps: number, series: number, acumuladoReps: number }> = {};
    r.rutina_ejercicios?.forEach((re) => {
      initial[re.id_ejercicio] = { reps: 0, series: 0, acumuladoReps: 0 };
    });
    setResultados(initial);
  };

  const handleInputChange = (id: number, field: 'reps', val: string) => {
    let num = parseInt(val) || 0;
    if (num > 15) num = 15;
    
    setResultados({ 
      ...resultados, 
      [id]: { 
        ...resultados[id], 
        [field]: num 
      } 
    });
  };

  const handleTerminarSerie = (id: number, metaSeries: number) => {
    const actual = resultados[id] || { reps: 0, series: 0, acumuladoReps: 0 };
    if (actual.series >= metaSeries) return;

    setResultados({
      ...resultados,
      [id]: {
        ...actual,
        series: actual.series + 1,
        acumuladoReps: actual.acumuladoReps + actual.reps, // Acumulamos lo que hizo en esta serie
        reps: 0 // Reseteamos para la siguiente serie como pidió el usuario
      }
    });
  };

  const guardarSesion = async () => {
    try {
      if (!rutinaSeleccionada) return;
      
      const ejerciciosParaEnviar = Object.entries(resultados)
        .map(([id, val]) => {
          const idEj = parseInt(id);
          const re = rutinaSeleccionada.rutina_ejercicios?.find(x => x.id_ejercicio === idEj);
          
          // Calculamos el promedio de reps por serie para que el backend (reps * series) de el total real
          // Si el usuario marcó 0 series, no enviamos este ejercicio
          if (val.series === 0) return null;

          const promedioReps = val.series > 0 ? val.acumuladoReps / val.series : 0;

          return {
            id_ejercicio: idEj,
            reps_realizadas: re?.ejercicio.es_tiempo ? 1 : Math.round(promedioReps),
            series_realizadas: val.series
          };
        })
        .filter(ej => ej !== null); // Solo enviamos lo realizado

      if (ejerciciosParaEnviar.length === 0) {
        setMensaje("No has registrado ninguna serie");
        return;
      }

      const res = await sesionesService.registrarEntrenamiento(rutinaSeleccionada.id_rutina, ejerciciosParaEnviar as any);
      setMensaje(`¡Excelente! Ganaste ${res.xpGanada} XP.`);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err: any) {
      console.error("Error al guardar:", err);
      setMensaje(err.response?.data?.mensaje || "Error al guardar entrenamiento");
    }
  };

  if (!rutinaSeleccionada) {
    return (
      <div className="fade-in" style={{ padding: '100px 20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <Header />
      <h1 className="text-gradient">ELIGE TU DESAFÍO</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '3rem' }}>
          {rutinas.length > 0 ? (
            rutinas.map(r => (
              <div key={r.id_rutina} className="glass stat-card" style={{ cursor: 'pointer', padding: '2rem' }} onClick={() => seleccionarRutina(r)}>
                <h3 style={{ color: 'var(--volt)' }}>{r.nombre}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{r.rutina_ejercicios?.length || 0} Ejercicios</p>
                <Boton style={{ marginTop: '1rem' }}>COMENZAR</Boton>
              </div>
            ))
          ) : (
            <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '3rem' }}>
              <p style={{ color: 'var(--text-secondary)' }}>
                {location.state?.rutina ? 'Cargando entrenamiento...' : 'No tienes rutinas asignadas.'}
              </p>
            </div>
          )}
        </div>
        <Boton onClick={() => navigate('/dashboard')} style={{ marginTop: '3rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>VOLVER AL DASHBOARD</Boton>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ padding: '100px 20px', maxWidth: '600px', margin: '0 auto' }}>
      <Header />
      <header className="glass" style={{ padding: '1.5rem', borderRadius: '20px', textAlign: 'center', marginBottom: '2rem' }}>
        <p style={{ margin: 0, color: 'var(--volt-yellow)', fontSize: '0.8rem', letterSpacing: '2px' }}>MODO ASISTENTE</p>
        <h2 style={{ margin: 0 }}>{rutinaSeleccionada.nombre}</h2>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {rutinaSeleccionada.rutina_ejercicios?.map((re) => {
          const res = resultados[re.id_ejercicio] || { reps: 0, series: 0 };
          const quedan = Math.max(0, re.series - res.series);
          const metaCumplida = res.series >= re.series;

          return (
            <div key={re.id_ejercicio} className="glass" style={{ padding: '1.5rem', borderRadius: '16px', border: metaCumplida ? '2px solid var(--volt)' : '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0 }}>{re.ejercicio.nombre}</h4>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: metaCumplida ? 'var(--volt)' : 'var(--text-secondary)' }}>
                    {res.series} / {re.series} SERIES
                  </span>
                </div>
              </div>
              
              {!re.ejercicio.es_tiempo && !metaCumplida && (
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ margin: '0 0 5px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Reps logradas en esta serie:</p>
                  <input 
                    type="number" 
                    className="input-field"
                    style={{ width: '100%', textAlign: 'center', fontSize: '1.2rem' }}
                    placeholder="Escribe el número"
                    value={res.reps || ""}
                    onChange={(e) => handleInputChange(re.id_ejercicio, 'reps', e.target.value)}
                  />
                </div>
              )}

              {metaCumplida ? (
                <div style={{ textAlign: 'center', padding: '0.5rem', color: 'var(--volt)', fontWeight: 700, fontSize: '0.9rem' }}>
                  ¡OBJETIVO CUMPLIDO! 🏆
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Boton 
                    onClick={() => handleTerminarSerie(re.id_ejercicio, re.series)}
                    style={{ 
                      background: re.ejercicio.es_tiempo ? 'var(--volt)' : 'white',
                      color: 'black',
                      padding: '0.8rem'
                    }}
                  >
                    {re.ejercicio.es_tiempo ? 'TERMINADO' : 'REGISTRAR SERIE'}
                  </Boton>
                  <p style={{ margin: 0, textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {quedan === 1 ? '¡Última serie, vamos!' : `Te quedan ${quedan} series más`}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        <Boton 
          onClick={guardarSesion} 
          style={{ marginTop: '2rem', padding: '1.2rem', fontSize: '1.1rem', background: 'var(--volt)', color: 'black', fontWeight: 800 }}
        >
          FINALIZAR ENTRENAMIENTO
        </Boton>
        
        <button onClick={() => setRutinaSeleccionada(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline', marginTop: '1rem' }}>
          Cancelar y volver
        </button>
      </div>

      {mensaje && (
        <div className="glass fade-in" style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', padding: '1rem 2rem', borderRadius: '50px', border: '1px solid var(--volt-yellow)', zIndex: 1000 }}>
          <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--volt-yellow)' }}>{mensaje}</p>
        </div>
      )}
    </div>
  );
};

export default Entrenamiento;
