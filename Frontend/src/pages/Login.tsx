import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UsuariosService } from '../services/usuarios.services'
import Input from '../components/Input'
import Boton from '../components/Boton'

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    try {
      await UsuariosService.login({ email, contrasena })
      navigate('/dashboard')
    } catch (err: any) {
      const serverMsg = err.response?.data?.message || 'No se encontro el usuario y/o la contraseña';
      setError(serverMsg);
      console.error('ERROR LOGIN:', err);
    }
  }

  return (
    <div className="fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}>
      <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '2rem' }}>BIENVENIDO</h1>
        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={contrasena}
            onChange={e => setContrasena(e.target.value)}
            required
          />
          <Boton type="submit" style={{ marginTop: '1rem' }}>Iniciar Sesión</Boton>
          {error && <p className="error-message">{error}</p>}
        </form>
        <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          ¿No tienes cuenta? <Link to="/register" className="auth-link">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
