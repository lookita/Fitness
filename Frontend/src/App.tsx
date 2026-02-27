import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Entrenamiento from './pages/Entrenamiento'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/entrenamiento" element={<Entrenamiento />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
