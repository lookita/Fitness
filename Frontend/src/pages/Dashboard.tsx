import React, { useEffect, useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { sesionesService } from '../services/sesiones.services';
import { UsuariosService } from '../services/usuarios.services';
import Boton from '../components/Boton';
import Header from '../components/Header';
import type { DashboardData } from '../types';

const Dashboard: FC = () => {
  const [data, setData] = useState<DashboardData | null>(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const dashboardData = await sesionesService.getDashboardData();
        if (dashboardData.error) {
          navigate('/login');
          return;
        }
        setData(dashboardData);
      } catch (err: any) {
        console.error("Error cargando dashboard:", err);
        if (err.response?.status === 401) {
          navigate('/login');
        } else {
          setError('Error de conexión con el servidor');
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await UsuariosService.logout();
    } catch {
      console.error("Error al cerrar sesión");
    }
    navigate('/login');
  };

  const handleAvanzarSemana = async () => {
    if (!window.confirm("¿Estás seguro de que quieres pasar a la siguiente etapa? Se validará tu XP acumulada.")) return;
    
    try {
      const res = await UsuariosService.avanzarSemana();
      if (res.data.error) {
        alert(res.data.error);
      } else {
        alert(res.data.mensaje || "¡Felicitaciones! Has avanzado de etapa.");
        window.location.reload();
      }
    } catch (err: any) {
      alert(err.response?.data?.error || "No cumples con los requisitos de XP para avanzar aún.");
    }
  };

  if (loading) return <div style={{ color: 'white', textAlign: 'center', paddingTop: '100px' }}>Cargando Fitness...</div>;
// ... (rest of the component logic)

  if (error) return (
    <div style={{ textAlign: 'center', paddingTop: '100px' }}>
      <p style={{ color: 'var(--error-red)' }}>{error}</p>
      <Boton onClick={() => window.location.reload()} style={{ width: 'auto' }}>Reintentar</Boton>
    </div>
  );

  if (!data) return null;

  // Cálculo de XP para la barra (ahora sobre 1000 XP por nivel)
  const xpBaseNivel = (data.perfil?.nivel - 1) * 1000;
  const xpGanadaEnNivel = (data.perfil?.xp || 0) - xpBaseNivel;
  const xpPorcentaje = Math.min((xpGanadaEnNivel / 1000) * 100, 100);

  // Detección de día actual
  const diasSemanales = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const diaHoy = diasSemanales[new Date().getDay()];

  // Ordenar todas las rutinas de la semana
  const diasOrden = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  const rutinasSemanales = [...(data.rutinas || [])].sort((a, b) => {
    const indexA = diasOrden.findIndex(d => a.nombre.includes(d));
    const indexB = diasOrden.findIndex(d => b.nombre.includes(d));
    return indexA - indexB;
  });

  // Cálculo de semana global (1 a 4) y fase
  const semanaGlobal = ((data.perfil?.fase - 1) * 2) + (data.perfil?.semana || 1);
  const faseVisual = semanaGlobal > 2 ? 2 : 1;

  return (
    <div className="fade-in" style={{ width: '100vw', minHeight: '100vh', padding: '100px 20px 20px' }}>
      <Header />

      <div className="dashboard-container">
        {/* NIVEL Y XP */}
        <section className="glass stat-card" style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, color: 'var(--volt-yellow)' }}>Nivel {data.perfil?.nivel || 1}</h2>
            <div className="xp-bar-track" style={{ width: '300px', marginTop: '10px' }}>
              <div className="xp-bar-fill" style={{ width: `${xpPorcentaje}%` }}></div>
            </div>
            <p style={{ margin: '8px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {xpGanadaEnNivel} / 1000 XP para el siguiente nivel
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Hoy es {diaHoy}</p>
            <h3 style={{ margin: 0, textTransform: 'uppercase', color: 'var(--volt)' }}>
              FASE {faseVisual} - SEMANA {semanaGlobal}
            </h3>
          </div>
        </section>

        {/* CALENDARIO SEMANAL */}
        <section className="glass stat-card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="text-gradient" style={{ marginBottom: '1.5rem' }}>TU PLAN SEMANAL</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {rutinasSemanales.map((rutina) => {
              const esHoy = rutina.nombre.includes(diaHoy);
              const estaCompletada = rutina.rutina_ejercicios?.every(re => {
                const p = data.progreso.find(p => p.ejercicio === re.ejercicio?.nombre);
                return p ? p.maestreado : false;
              });

              return (
                <div 
                  key={rutina.id_rutina} 
                  className={`glass ${esHoy ? 'hoy-active' : ''}`} 
                  style={{ 
                    padding: '1.5rem', 
                    borderRadius: '16px', 
                    border: esHoy ? '2px solid var(--volt)' : '1px solid rgba(255,255,255,0.05)',
                    background: esHoy ? 'rgba(212,255,0,0.03)' : 'rgba(255,255,255,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: esHoy ? 'var(--volt)' : 'var(--text-secondary)', letterSpacing: '1px' }}>
                        {rutina.nombre.split(' - ').pop()?.toUpperCase()}
                      </span>
                      {estaCompletada && <span style={{ fontSize: '0.7rem', color: 'var(--volt)' }}>🏆 COMPLETADO</span>}
                    </div>
                    <h4 style={{ margin: '8px 0', fontSize: '1.1rem' }}>{rutina.nombre}</h4>
                    
                    {/* Indicador de XP Diaria (Meta: 50 XP) */}
                    <div style={{ marginTop: '0.5rem' }}>
                      {(() => {
                        const totalEjercicios = rutina.rutina_ejercicios?.length || 0;
                        const marcados = rutina.rutina_ejercicios?.filter(re => 
                          data.progreso.find(p => p.ejercicio === re.ejercicio?.nombre && p.maestreado)
                        ).length || 0;
                        const xpGanadaHoy = totalEjercicios > 0 ? Math.floor((marcados / totalEjercicios) * 50) : 0;
                        const xpFaltante = 50 - xpGanadaHoy;

                        return (
                          <>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: estaCompletada ? 'var(--volt)' : 'var(--text-secondary)' }}>
                              {estaCompletada 
                                ? "🏆 META DIARIA ALCANZADA (50/50 XP)" 
                                : `⏳ Faltan ${xpFaltante} XP para los 50 de hoy (${xpGanadaHoy}/50)`}
                            </p>
                            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginTop: '6px' }}>
                              <div style={{ width: `${(xpGanadaHoy / 50) * 100}%`, height: '100%', background: estaCompletada ? 'var(--volt)' : 'var(--volt-yellow)', borderRadius: '2px', transition: 'width 0.3s ease' }}></div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  
                  <Boton 
                    onClick={() => navigate('/entrenamiento', { state: { rutina } })} 
                    style={{ 
                      marginTop: '1.5rem', 
                      padding: '0.6rem', 
                      fontSize: '0.8rem',
                      background: estaCompletada ? 'transparent' : 'var(--volt)',
                      color: estaCompletada ? 'var(--text-secondary)' : 'black',
                      border: estaCompletada ? '1px solid rgba(255,255,255,0.1)' : 'none',
                      width: '100%'
                    }}
                  >
                    {estaCompletada ? 'RE-ENTRENAR' : 'ENTRENAR AHORA'}
                  </Boton>
                </div>
              );
            })}

            {/* Fines de semana */}
            {(diaHoy === 'Sábado' || diaHoy === 'Domingo') && (
               <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <div>
                    <p style={{ fontSize: '1.5rem', margin: 0 }}>🧘‍♂️</p>
                    <p style={{ margin: '5px 0 0', fontSize: '0.9rem' }}>Día de Recuperación</p>
                  </div>
               </div>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Boton 
              onClick={handleLogout} 
              style={{ marginTop: '2.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', width: 'auto' }}
            >
              Cerrar Sesión
            </Boton>
            
            <Boton 
              onClick={handleAvanzarSemana} 
              style={{ marginTop: '2.5rem', marginLeft: '1rem', background: 'var(--volt)', color: 'black', width: 'auto', fontWeight: 'bold' }}
            >
              PASAR A SIGUIENTE SEMANA ⏩
            </Boton>
          </div>
        </section>

        {/* PROGRESO POR EJERCICIO */}
        <section className="glass stat-card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="text-gradient">MI MAESTRÍA (Hitos Alcanzados)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            {data.progreso.map((p, idx: number) => (
              <div key={idx} className="glass" style={{ padding: '1rem' }}>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{p.ejercicio}</p>
                <p style={{ margin: '5px 0 0', fontWeight: 700, color: p.maestreado ? 'var(--volt)' : 'white' }}>
                  {p.mejor_record} Reps {p.maestreado ? '🏆' : ''}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
