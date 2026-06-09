import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  subscribeGeneral,
  subscribeHistoria,
  subscribeCursos,
  getFirebaseStatus,
} from '../services/contenidoService';
import { DEFAULT_GENERAL, DEFAULT_HISTORIA } from '../data/contenidoDefaults';

const ContenidoContext = createContext(null);

export function ContenidoProvider({ children }) {
  const [general, setGeneral] = useState(DEFAULT_GENERAL);
  const [historia, setHistoria] = useState(DEFAULT_HISTORIA);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const firebaseStatus = useMemo(() => getFirebaseStatus(), []);

  useEffect(() => {
    let ready = 0;
    const check = () => {
      ready += 1;
      if (ready >= 3) setLoading(false);
    };

    const unsubG = subscribeGeneral((data) => {
      setGeneral(data);
      check();
    });
    const unsubH = subscribeHistoria((data) => {
      setHistoria(data);
      check();
    });
    const unsubC = subscribeCursos((data) => {
      setCursos(data);
      check();
    });

    return () => {
      unsubG();
      unsubH();
      unsubC();
    };
  }, []);

  const value = useMemo(
    () => ({ general, historia, cursos, loading, firebaseStatus }),
    [general, historia, cursos, loading, firebaseStatus]
  );

  return <ContenidoContext.Provider value={value}>{children}</ContenidoContext.Provider>;
}

export function useContenido() {
  const ctx = useContext(ContenidoContext);
  if (!ctx) throw new Error('useContenido debe usarse dentro de ContenidoProvider');
  return ctx;
}
