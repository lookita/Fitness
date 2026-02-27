import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UsuariosService } from '../services/usuarios.services'
import Card from '../components/Card'
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
      await UsuariosService.crear({
        nombre,
        email,
        contrasena,
      })

      navigate('/')
    } catch (err: any) {
        console.error('ERROR BACKEND 👉', err)
        setError(err?.response?.data?.message || 'Error al registrar usuario')
    }
  }

  return (
    <Card title="CREAR CUENTA">
      <form onSubmit={handleSubmit}>
        <Input
          label="Nombre"
          type="text"
          placeholder="Ingrese su nombre"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
        />

        <Input
          label="Email"
          type="email"
          placeholder="email@fitness.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="Ingrese su contraseña"
          value={contrasena}
          onChange={e => setContrasena(e.target.value)}
          required
        />

        <Boton type="submit">Registrarse</Boton>

        {error && <p className="error-message">{error}</p>}
      </form>

      <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        ¿Ya tienes una cuenta? <Link to="/" className="auth-link">Inicia sesión</Link>
      </p>
    </Card>
  )
}
