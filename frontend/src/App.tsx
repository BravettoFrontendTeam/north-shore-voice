import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Demo from './pages/Demo'
import AdminEmpathy from './pages/AdminEmpathy'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/admin/empathy" element={<AdminEmpathy />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  )
}

export default App

