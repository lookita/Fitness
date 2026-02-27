import { Link, useNavigate } from 'react-router-dom';
import { UsuariosService } from '../services/usuarios.services';

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await UsuariosService.logout();
    } catch (e) {
      console.error("Error al cerrar sesión", e);
    }
    navigate('/login');
  };

  return (
    <header className="glass fade-in" style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      padding: '1rem 2.5rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      zIndex: 1000 
    }}>
      <div 
        onClick={() => navigate('/dashboard')} 
        className="text-gradient" 
        style={{ cursor: 'pointer', fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '1px' }}
      >
        FITNESS PRO
      </div>

      <nav style={{ display: 'flex', gap: '2rem' }}>
        <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', fontWeight: 500 }}>Dashboard</Link>
        <Link to="/rutinas" style={{ color: 'white', textDecoration: 'none', fontWeight: 500 }}>Rutinas</Link>
        <Link to="/catalogo" style={{ color: 'white', textDecoration: 'none', fontWeight: 500 }}>Catálogo</Link>
        <Link to="/entrenamiento" style={{ color: 'white', textDecoration: 'none', fontWeight: 500 }}>Entrenar</Link>
      </nav>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button 
          onClick={handleLogout} 
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}
        >
          Salir
        </button>
      </div>
    </header>
  );
}
