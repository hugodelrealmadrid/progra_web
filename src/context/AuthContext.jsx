/**
 * AuthContext — Firebase Authentication real
 *
 * - Login / registro con email+contraseña via Firebase Auth
 * - Perfil del usuario (nombre, rol, activo) guardado en Firestore: usuarios/{uid}
 * - onAuthStateChanged: detecta sesión activa automáticamente sin localStorage
 * - Tiempo real: si el admin cambia el rol de un usuario, el cambio llega
 *   sin que el usuario tenga que hacer logout/login
 */

import {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
} from 'firebase/auth';
import {
  doc, getDoc, setDoc, updateDoc, collection,
  onSnapshot, query, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext(null);

const PANEL_BY_ROLE = {
  admin:      '/panel/admin',
  profesor:   '/panel/profesor',
  estudiante: '/panel/estudiante',
};

const ROL_LABEL = {
  admin:      'Administrador',
  profesor:   'Profesor',
  estudiante: 'Estudiante',
};

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  // user: datos de sesión enriquecidos con perfil Firestore
  const [user,     setUser]     = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [usuarios, setUsuarios] = useState([]);

  // ── 1. Escuchar cambios de autenticación ──────────────────────────────────
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Leer perfil desde Firestore en tiempo real
        const perfilRef = doc(db, 'usuarios', firebaseUser.uid);
        const unsub = onSnapshot(perfilRef, (snap) => {
          if (snap.exists()) {
            const perfil = snap.data();
            setUser({
              uid:    firebaseUser.uid,
              email:  firebaseUser.email,
              nombre: perfil.nombre ?? firebaseUser.displayName ?? 'Usuario',
              rol:    perfil.rol    ?? 'estudiante',
              activo: perfil.activo ?? true,
              avatar: perfil.avatar ?? null,
            });
          } else {
            // Perfil no existe aún (registro nuevo)
            setUser({
              uid:    firebaseUser.uid,
              email:  firebaseUser.email,
              nombre: firebaseUser.displayName ?? 'Usuario',
              rol:    'estudiante',
              activo: true,
              avatar: null,
            });
          }
          setLoading(false);
        });
        return unsub; // limpieza
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return unsubAuth;
  }, []);

  // ── 2. Lista de todos los usuarios (solo admin la necesita) ───────────────
  useEffect(() => {
    const q = query(collection(db, 'usuarios'), orderBy('nombre'));
    const unsub = onSnapshot(q, (snap) => {
      setUsuarios(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────
  const loginWithCredentials = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged ya actualiza `user` automáticamente
      // Redirigir según rol (leemos el perfil recién actualizado)
      const perfil = await getDoc(doc(db, 'usuarios', auth.currentUser.uid));
      const rol    = perfil.exists() ? (perfil.data().rol ?? 'estudiante') : 'estudiante';
      navigate(PANEL_BY_ROLE[rol] ?? '/');
      return { ok: true };
    } catch (e) {
      const msgs = {
        'auth/user-not-found':  'No existe una cuenta con ese email.',
        'auth/wrong-password':  'Contraseña incorrecta.',
        'auth/invalid-email':   'Email inválido.',
        'auth/user-disabled':   'Esta cuenta está desactivada.',
        'auth/too-many-requests':'Demasiados intentos. Intenta más tarde.',
      };
      return { ok: false, error: msgs[e.code] ?? 'Error al iniciar sesión.' };
    }
  };

  // ── Registro ──────────────────────────────────────────────────────────────
  const register = async ({ nombre, email, password, rol = 'estudiante' }) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      // Guardar perfil en Firestore
      await setDoc(doc(db, 'usuarios', cred.user.uid), {
        uid:      cred.user.uid,
        nombre,
        email,
        rol,
        activo:   true,
        creadoEn: serverTimestamp(),
      });
      return { ok: true };
    } catch (e) {
      const msgs = {
        'auth/email-already-in-use': 'Ese email ya está registrado.',
        'auth/weak-password':        'La contraseña debe tener al menos 6 caracteres.',
        'auth/invalid-email':        'Email inválido.',
      };
      return { ok: false, error: msgs[e.code] ?? 'Error al registrar.' };
    }
  };

  // ── Crear usuario (solo admin) ────────────────────────────────────────────
  // NOTA: createUserWithEmailAndPassword cierra la sesión actual en el cliente.
  // Para evitar esto en producción, usa Firebase Admin SDK en una Cloud Function.
  // Aquí se hace directo por simplicidad de proyecto académico.
  const addUser = async ({ nombre, email, password, rol }) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'usuarios', cred.user.uid), {
        uid: cred.user.uid, nombre, email, rol, activo: true,
        creadoEn: serverTimestamp(),
      });
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  };

  // ── Actualizar perfil ─────────────────────────────────────────────────────
  const updateUser = async (uid, updates) => {
    await updateDoc(doc(db, 'usuarios', uid), updates);
    // Si el usuario actualizado es el actual, onSnapshot lo propagará solo
  };

  // ── Cambiar contraseña ────────────────────────────────────────────────────
  const cambiarPassword = async (nuevaPassword) => {
    if (!auth.currentUser) return { ok: false, error: 'Sin sesión activa.' };
    try {
      await updatePassword(auth.currentUser, nuevaPassword);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = async () => {
    await signOut(auth);
    navigate('/');
  };

  // ── Helpers de rol ────────────────────────────────────────────────────────
  const rolLabel    = user ? (ROL_LABEL[user.rol] ?? user.rol) : '';
  const rolLabelOf  = (rol) => ROL_LABEL[rol] ?? rol;
  const esAdmin     = user?.rol === 'admin';
  const esProfesor  = user?.rol === 'profesor';
  const esEstudiante = user?.rol === 'estudiante';

  const value = useMemo(() => ({
    user,
    usuarios,
    loading,
    isAuthenticated: Boolean(user),
    rolLabel,
    rolLabelOf,
    esAdmin,
    esProfesor,
    esEstudiante,
    loginWithCredentials,
    register,
    addUser,
    updateUser,
    cambiarPassword,
    logout,
  }), [user, usuarios, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
