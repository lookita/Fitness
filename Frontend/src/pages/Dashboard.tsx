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
 // Changed 'err' to '_error' to fix lint error for unused variable
      console.error("Error al cerrar sesión:"); // Removed _error as it's not caught
    }
    navigate('/login');
  };

  if (loading) return <div style={{ color: 'white', textAlign: 'center', paddingTop: '100px' }}>Cargando Fitness...</div>;

  if (error) return (
    <div style={{ textAlign: 'center', paddingTop: '100px' }}>
      <p style={{ color: 'var(--error-red)' }}>{error}</p>
      <Boton onClick={() => window.location.reload()} style={{ width: 'auto' }}>Reintentar</Boton>
    </div>
  );

  if (!data) return null;

  // Cálculo de XP para la barra
  const xpPorcentaje = Math.min(((data.perfil?.xp || 0) / 1000) * 100, 100);

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
              {data.perfil?.xp || 0} / 1000 XP para el siguiente nivel
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Estado Actual</p>
            <h3 style={{ margin: 0, textTransform: 'uppercase' }}>Fase 1</h3>
          </div>
        </section>

        {/* RUTINAS */}
        <section className="glass stat-card">
          <h3 className="text-gradient">MIS RUTINAS</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {data.rutinas?.map((rutina) => (
              <div key={rutina.id_rutina} className="glass" style={{ padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>{rutina.nombre}</span>
                <Boton onClick={() => navigate('/entrenamiento')} style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Entrenar</Boton>
              </div>
            ))}
          </div>
          <Boton 
            onClick={handleLogout} 
            style={{ marginTop: '2rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}
          >
            Cerrar Sesión
          </Boton>
        </section>

        {/* PROGRESO */}
        <section className="glass stat-card">
          <h3 className="text-gradient">MI MAESTRÍA</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
            {data.progreso.map((p, idx: number) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem' }}>{p.ejercicio}</span>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: p.maestreado ? 'var(--volt-yellow)' : 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 700 }}>
                    {p.mejor_record} reps {p.maestreado ? '🏆' : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
