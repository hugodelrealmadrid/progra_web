import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Placeholder from './pages/Placeholder';
import Login from './pages/Login';
import Registro from './pages/Registro';
import PanelPage from './pages/PanelPage';

export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/historia" element={<Placeholder title="Sobre la Academia — Historia" />} />
        <Route path="/ofertas" element={<Placeholder title="Docentes / Oferta académica" />} />
        <Route path="/contacto" element={<Placeholder title="Contacto Principal" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/panel/admin" element={<PanelPage rol="admin" />} />
        <Route path="/panel/profesor" element={<PanelPage rol="profesor" />} />
        <Route path="/panel/estudiante" element={<PanelPage rol="estudiante" />} />
      </Routes>
    </MainLayout>
  );
}
