import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Protege rutas según autenticación y rol.
 *
 * Uso básico (solo requiere login):
 *   <PrivateRoute> <MiPagina /> </PrivateRoute>
 *
 * Uso con rol específico:
 *   <PrivateRoute rol="estudiante"> <EstudiantePanel /> </PrivateRoute>
 */
export default function PrivateRoute({ rol, children }) {
  const { user } = useAuth();

  // No autenticado → al login
  if (!user) return <Navigate to="/login" replace />;

  // Autenticado pero con rol incorrecto → a su propio panel
  if (rol && user.rol !== rol) {
    const panelByRol = {
      admin: '/panel/admin',
      profesor: '/panel/profesor',
      estudiante: '/panel/estudiante',
    };
    return <Navigate to={panelByRol[user.rol] ?? '/'} replace />;
  }

  return children;
}
