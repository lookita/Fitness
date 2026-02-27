import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UsuariosService } from '../services/usuarios.services'
import Input from '../components/Input'
import Boton from '../components/Boton'

export default function Register() {
  const navigate = useNavigate()

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!nombre || !email || !contrasena) {
      setError('Todos los campos son obligatorios')
      return
    }

    try {
      await UsuariosService.crear({ nombre, email, contrasena })
      navigate('/')
    } catch (err: any) {
      console.error('ERROR BACKEND 👉', err)
      setError(err?.response?.data?.message || 'Error al registrar usuario')
    }
  }

  return (
    <div className="fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}>
      <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '2rem' }}>ÚNETE AL EQUIPO</h1>
        <form onSubmit={handleSubmit}>
          <Input
            label="Nombre completo"
            type="text"
            placeholder="Lucas Silva"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="fitness@gym.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="Paso a paso..."
            value={contrasena}
            onChange={e => setContrasena(e.target.value)}
            required
          />
          <Boton type="submit" style={{ marginTop: '1rem' }}>Crear Cuenta</Boton>
          {error && <p className="error-message">{error}</p>}
        </form>
        <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          ¿Ya tienes cuenta? <Link to="/login" className="auth-link">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
