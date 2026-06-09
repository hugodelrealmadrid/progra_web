import { Routes, Route } from 'react-router-dom';
import { AcademicoProvider } from './context/AcademicoContext';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import EstudianteLayout from './layouts/EstudianteLayout';
import ProfesorLayout from './layouts/ProfesorLayout';
import Home from './pages/Home';
import Historia from './pages/Historia';
import Ofertas from './pages/Ofertas';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import Registro from './pages/Registro';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCursos from './pages/admin/AdminCursos';
import AdminUsuarios from './pages/admin/AdminUsuarios';
import AdminInscripciones from './pages/admin/AdminInscripciones';
import AdminPagos from './pages/admin/AdminPagos';
import AdminMensajes from './pages/admin/AdminMensajes';
import AdminContenido from './pages/admin/AdminContenido';
import EstudiantePanel from './pages/estudiante/EstudiantePanel';
import ProfesorDashboard from './pages/profesor/ProfesorDashboard';
import ProfesorCursos from './pages/profesor/ProfesorCursos';
import ProfesorAlumnos from './pages/profesor/ProfesorAlumnos';
import ProfesorCalificaciones from './pages/profesor/ProfesorCalificaciones';
import ProfesorInformes from './pages/profesor/ProfesorInformes';
import ProfesorMateriales from './pages/profesor/ProfesorMateriales';

export default function App() {
  return (
    <AcademicoProvider>
      <Routes>
        {/* ── Rutas públicas ── */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/historia" element={<Historia />} />
          <Route path="/ofertas" element={<Ofertas />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
        </Route>

        {/* ── Panel Admin (solo rol: admin) ── */}
        <Route
          path="/panel/admin"
          element={
            <PrivateRoute rol="admin">
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="cursos" element={<AdminCursos />} />
          <Route path="usuarios" element={<AdminUsuarios />} />
          <Route path="inscripciones" element={<AdminInscripciones />} />
          <Route path="pagos" element={<AdminPagos />} />
          <Route path="mensajes" element={<AdminMensajes />} />
          <Route path="contenido" element={<AdminContenido />} />
        </Route>

        {/* ── Panel Estudiante (solo rol: estudiante) ── */}
        <Route
          path="/panel/estudiante"
          element={
            <PrivateRoute rol="estudiante">
              <EstudianteLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<EstudiantePanel />} />
        </Route>

        {/* ── Panel Profesor (solo rol: profesor) ── */}
        <Route
          path="/panel/profesor"
          element={
            <PrivateRoute rol="profesor">
              <ProfesorLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<ProfesorDashboard />} />
          <Route path="cursos" element={<ProfesorCursos />} />
          <Route path="alumnos" element={<ProfesorAlumnos />} />
          <Route path="calificaciones" element={<ProfesorCalificaciones />} />
          <Route path="informes" element={<ProfesorInformes />} />
          <Route path="materiales" element={<ProfesorMateriales />} />
        </Route>
      </Routes>
    </AcademicoProvider>
  );
}
