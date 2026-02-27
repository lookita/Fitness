import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sesionesService } from '../services/sesiones.services';
import { UsuariosService } from '../services/usuarios.services';
import Header from '../components/Header';


const Dashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
      } catch (error) {
        console.error("Error cargando dashboard:", error);
        // navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await UsuariosService.logout();
      // navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // navigate('/login');
    }
  };

  // if (loading) return <div>Cargando...</div>;
  // if (!data || data.error) return (
  //   <div>
  //     <p>Sin sesión activa</p>
  //     <button onClick={() => navigate('/login')}>Ir a Login</button>
  //   </div>
  // );

  return (
    // <div>
    //   <header>
    //     <h1>Hola, {data.perfil?.nombre || 'Usuario'}</h1>
    //     <button onClick={handleLogout}>Salir</button>
    //   </header>
      
    //   <section>
    //     <h2>Nivel {data.perfil.nivel}</h2>
    //     <p>XP: {data.perfil.xp}</p>
    //   </section>

    //   <section>
    //     <h3>Rutinas</h3>
    //     {data.rutinas.map((rutina: any) => (
    //       <div key={rutina.id_rutina}>
    //         <span>{rutina.nombre}</span>
    //         <button onClick={() => navigate('/entrenamiento')}>Entrenar</button>
    //       </div>
    //     ))}
    //   </section>

    //   <section>
    //     <h3>Maestría</h3>
    //     {data.progreso.map((p: any, idx: number) => (
    //       <div key={idx}>
    //         <span>{p.ejercicio} - Récord: {p.mejor_record}</span>
    //         {p.maestreado ? <span>(Completado)</span> : <span>(En progreso)</span>}
    //       </div>
    //     )) || <p>Sin registros</p>}
    //   </section>
    // </div>

    <Header></Header>
  );
};

export default Dashboard;
