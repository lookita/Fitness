

export default function Header(){
    return <div className="header-content">
    <div className="logo">FITNESS</div>

    <nav className="nav">
        <div>
            <a href="#">Inicio</a>
        </div>
      <div>
        <a href="#">Programas</a>
      </div>
      <div>
        <a href="#">Contacto</a>
      </div>
    </nav>

    <div className="btn-header">
      <button className="btn-header-login">Login</button>
      <button className="btn-header-register">Registrarse</button>
    </div>

  </div>
}
