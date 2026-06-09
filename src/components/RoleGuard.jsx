import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RoleGuard({ rol, children }) {
  const { user } = useAuth();

  if (!user || user.rol !== rol) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
