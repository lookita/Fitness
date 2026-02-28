import React, { useEffect, useState, type FC } from 'react';
import Header from '../components/Header';
import { api } from '../services/api';
import type { Ejercicio } from '../types';

const MOCK_EJERCICIOS: Ejercicio[] = [
  { id_ejercicio: 1, nombre: 'Flexiones de rodillas', nivel_requerido: 1, fase: 1, dificultad: 'facil', descripcion: 'Flexiones con apoyo en rodillas.', grupo: { id_grupo: 1, nombre: 'Empuje' } },
  { id_ejercicio: 2, nombre: 'Sentadilla básica', nivel_requerido: 1, fase: 1, dificultad: 'facil', descripcion: 'Sentadilla con peso corporal.', grupo: { id_grupo: 2, nombre: 'Piernas' } },
  { id_ejercicio: 3, nombre: 'Remo horizontal silla', nivel_requerido: 1, fase: 1, dificultad: 'facil', descripcion: 'Tirón usando una silla.', grupo: { id_grupo: 3, nombre: 'Tirón' } }
];

const Catalogo: FC = () => {
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroGrupo, setFiltroGrupo] = useState('Todos');

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get('/ejercicios/todos');
        setEjercicios(res.data.length > 0 ? res.data : MOCK_EJERCICIOS);
      } catch {
        console.warn('Usando Mock Data para Catálogo');
        setEjercicios(MOCK_EJERCICIOS);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const grupos = ['Todos', ...Array.from(new Set(ejercicios.map((e) => e.grupo?.nombre).filter(Boolean)))];
  
  const ejerciciosFiltrados = filtroGrupo === 'Todos'
    ? ejercicios
    : ejercicios.filter((e) => e.grupo?.nombre === filtroGrupo);

  const colorDificultad: Record<string, string> = {
    facil: '#4ade80',
    medio: 'var(--volt)',
    dificil: '#f87171',
  };

  return (
    <div className="fade-in" style={{ width: '100vw', minHeight: '100vh', padding: '100px 20px 40px' }}>
      <Header />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>CATÁLOGO</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Explora ejercicios por niveles.</p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          {grupos.map((g) => (
            <button
              key={g}
              onClick={() => setFiltroGrupo(g || 'Todos')}
              className="glass"
              style={{
                background: filtroGrupo === g ? 'var(--volt)' : 'rgba(255,255,255,0.05)',
                color: filtroGrupo === g ? '#000' : 'var(--text-secondary)',
                border: '1px solid var(--metallic-grey)',
                borderRadius: '20px',
                padding: '0.5rem 1.25rem',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                transition: 'all 0.2s'
              }}
            >
              {g}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>Cargando catálogo...</p>
        ) : (
          <div className="dashboard-container" style={{ padding: 0 }}>
            {ejerciciosFiltrados.map((ej) => (
              <div key={ej.id_ejercicio} className="glass-card stat-card" style={{ height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className="level-badge">NIV {ej.nivel_requerido}</span>
                  <span style={{
                    fontSize: '0.7rem', 
                    fontWeight: 700, 
                    color: colorDificultad[ej.dificultad] || '#fff',
                    textTransform: 'uppercase', 
                    letterSpacing: '1px'
                  }}>
                    {ej.dificultad}
                  </span>
                </div>
                <h3 style={{ margin: '0 0 0.5rem', fontWeight: 700 }}>{ej.nombre}</h3>
                <p style={{ color: 'var(--volt)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                  {ej.grupo?.nombre || 'General'} · Fase {ej.fase}
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                  {ej.descripcion}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalogo;
