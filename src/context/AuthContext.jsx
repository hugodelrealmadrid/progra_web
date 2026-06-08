import { createContext, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

const PANEL_BY_ROLE = {
  admin: '/panel/admin',
  profesor: '/panel/profesor',
  estudiante: '/panel/estudiante',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = (userData) => {
    setUser(userData);
    const path = PANEL_BY_ROLE[userData.rol] ?? '/';
    navigate(path);
  };

  const logout = () => {
    setUser(null);
    navigate('/');
  };

  const value = useMemo(
    () => ({ user, login, logout, isAuthenticated: Boolean(user) }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
