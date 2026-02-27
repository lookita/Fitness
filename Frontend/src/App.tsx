import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Entrenamiento from './pages/Entrenamiento'
import Catalogo from './pages/Catalogo'
import Rutinas from './pages/Rutinas'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/entrenamiento" element={<Entrenamiento />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/rutinas" element={<Rutinas />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
