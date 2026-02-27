import { useEffect, useState } from 'react'
import { UsuariosService } from '../services/usuarios.services'

export default function Index() {
  const [usuarios, setUsuarios] = useState<any[]>([])

  useEffect(() => {
    UsuariosService.obtenerTodos()
      .then(res => setUsuarios(res.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div>
      <h1>Hola rey</h1>

      <ul>
        {usuarios.map(usuario => (
          <li key={usuario.id_usuario}>
            {usuario.nombre} - {usuario.email}
          </li>
        ))}
      </ul>
    </div>
  )
}
