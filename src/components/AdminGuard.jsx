import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminGuard({ children }) {
  const { user } = useAuth();

  if (!user || user.rol !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
}
