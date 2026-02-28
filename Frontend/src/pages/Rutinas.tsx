import { useEffect, useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { sesionesService } from '../services/sesiones.services';
import Boton from '../components/Boton';
import type { Rutina } from '../types';

const MOCK_RUTINAS: Rutina[] = [
  { 
    id_rutina: 1, 
    nombre: 'Nivel 1 - Fase 1 - Rutina A', 
    nivel_objetivo: 1,
    fase_objetivo: 1,
    rutina_ejercicios: [
      { id_ejercicio: 1, ejercicio: { id_ejercicio: 1, nombre: 'Flexiones de rodillas', dificultad: 'facil', nivel_requerido: 1, fase: 1 }, series: 3, repeticiones: 8 },
      { id_ejercicio: 3, ejercicio: { id_ejercicio: 3, nombre: 'Plancha 20s', dificultad: 'facil', nivel_requerido: 1, fase: 1 }, series: 3, repeticiones: 1 }
    ] 
  }
];

const Rutinas: FC = () => {
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [loading, setLoading] = useState(true);
  const [rutinaAbierta, setRutinaAbierta] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const dashData = await sesionesService.getDashboardData();
        setRutinas(dashData.rutinas && dashData.rutinas.length > 0 ? dashData.rutinas : MOCK_RUTINAS);
      } catch {
        setRutinas(MOCK_RUTINAS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div style={{ color: 'white', textAlign: 'center', paddingTop: '100px' }}>Cargando planes...</div>;

  return (
    <div className="fade-in" style={{ width: '100vw', minHeight: '100vh', padding: '100px 20px 40px' }}>
      <Header />
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>TUS RUTINAS</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>Planes asignados a tu nivel actual.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {rutinas.length === 0 ? (
            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)' }}>No tienes rutinas asignadas aún.</p>
            </div>
          ) : (
            rutinas.map((rutina) => (
              <div key={rutina.id_rutina} className="glass-card" style={{ padding: '0' }}>
                <div 
                  onClick={() => setRutinaAbierta(rutinaAbierta === rutina.id_rutina ? null : rutina.id_rutina)}
                  style={{ padding: '1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div>
                    <span style={{ color: 'var(--volt)', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '2px' }}>PROGRESIÓN</span>
                    <h3 style={{ margin: '5px 0 0', fontWeight: 700 }}>{rutina.nombre}</h3>
                  </div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                    {rutinaAbierta === rutina.id_rutina ? '▲' : '▼'}
                  </span>
                </div>

                {rutinaAbierta === rutina.id_rutina && (
                  <div className="fade-in" style={{ padding: '0 1.5rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                      {rutina.rutina_ejercicios?.map((re) => (
                        <div key={re.id_ejercicio} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <p style={{ margin: 0, fontWeight: 600 }}>{re.ejercicio?.nombre}</p>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Repeticiones objetivo: {re.repeticiones}</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: 0, color: 'var(--volt)', fontWeight: 700 }}>{re.series} SERIES</p>
                          </div>
                        </div>
                      ))}
                      <Boton 
                        onClick={() => navigate('/entrenamiento')} 
                        style={{ marginTop: '1rem' }}
                      >
                        ENTRENAR AHORA
                      </Boton>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Rutinas;
