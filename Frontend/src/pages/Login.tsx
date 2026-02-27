import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UsuariosService } from '../services/usuarios.services'
import Card from '../components/Card'
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
    } catch (err) {
      setError('No se encontro el usuario y/o la contraseña')
      console.error(err)
    }
  }

  return (
    <Card title="INICIAR SESIÓN">
      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          placeholder="ejemplo@fitness.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="********"
          value={contrasena}
          onChange={e => setContrasena(e.target.value)}
          required
        />

        <Boton type="submit">Entrar</Boton>

        {error && <p className="error-message">{error}</p>}
      </form>

      <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        ¿No tienes cuenta? <Link to="/Register" className="auth-link">Regístrate</Link>
      </p>
    </Card>
  )
}
