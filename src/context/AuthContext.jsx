import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IMG } from '../data/images';

const AuthContext = createContext(null);
const USERS_KEY = 'amc_users';
const SESSION_KEY = 'amc_user';

const PANEL_BY_ROLE = {
  admin: '/panel/admin',
  profesor: '/panel/profesor',
  estudiante: '/panel/estudiante',
};

const ROL_LABEL = {
  admin: 'Administrador',
  profesor: 'Profesor',
  estudiante: 'Estudiante',
};

const DEFAULT_USERS = [
  { nombre: 'Emily Condori', email: 'emily@admin.amc.bo', password: 'demo1234', rol: 'admin', avatar: IMG.director },
  { nombre: 'Hugo Delgado', email: 'hugo@profesor.amc.bo', password: 'demo1234', rol: 'profesor', avatar: IMG.guitarra },
  { nombre: 'Flores Viza', email: 'flores@estudiante.amc.bo', password: 'demo1234', rol: 'estudiante', avatar: IMG.violin },
];

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
  return DEFAULT_USERS;
}

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(loadUsers);
  const [user, setUser] = useState(loadSession);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }, [user]);

  const login = (userData) => {
    setUser(userData);
    const path = PANEL_BY_ROLE[userData.rol] ?? '/';
    navigate(path);
  };

  const loginWithCredentials = (email, password) => {
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) return { ok: false, error: 'Email o contraseña incorrectos' };
    const session = { nombre: found.nombre, email: found.email, rol: found.rol, avatar: found.avatar };
    login(session);
    return { ok: true };
  };

  const register = ({ nombre, email, password, rol }) => {
    if (users.some((u) => u.email === email)) {
      return { ok: false, error: 'Ese email ya está registrado' };
    }
    const nuevo = {
      nombre,
      email,
      password,
      rol,
      avatar: IMG.ninos,
    };
    setUsers((prev) => [...prev, nuevo]);
    return { ok: true };
  };

  const addUser = (userData) => {
    if (users.some((u) => u.email === userData.email)) {
      return { ok: false, error: 'Ese email ya existe' };
    }
    setUsers((prev) => [...prev, { ...userData, avatar: userData.avatar ?? IMG.ninos }]);
    return { ok: true };
  };

  const updateUser = (email, updates) => {
    setUsers((prev) => prev.map((u) => (u.email === email ? { ...u, ...updates } : u)));
    if (user?.email === email) {
      setUser((prev) => ({ ...prev, ...updates, rol: updates.rol ?? prev.rol }));
    }
  };

  const logout = () => {
    setUser(null);
    navigate('/');
  };

  const value = useMemo(
    () => ({
      user,
      users,
      login,
      loginWithCredentials,
      register,
      addUser,
      updateUser,
      logout,
      isAuthenticated: Boolean(user),
      rolLabel: user ? ROL_LABEL[user.rol] : '',
      rolLabelOf: (rol) => ROL_LABEL[rol] ?? rol,
    }),
    [user, users]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
