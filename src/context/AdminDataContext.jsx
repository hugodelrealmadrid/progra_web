/**
 * AdminDataContext — Firestore tiempo real
 *
 * Colecciones:
 *   cursos          { nombre, nivel, instrumento, precio, cupos, inscritos, estado, tipo, descripcion }
 *   inscripciones   { estudiante, email, curso, nivel, fecha, pago, estado }
 *   pagos           { estudiante, curso, monto, moneda, fecha, metodo, estado }
 *   mensajes        { nombre, email, asunto, mensaje, leido, fecha }
 *   contenido/general  { titulo, subtitulo, cuerpo, boton }
 *   contenido/historia { titulo, subtitulo, cuerpo, boton }
 */

import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import {
  collection, doc, addDoc, setDoc, updateDoc, deleteDoc,
  onSnapshot, query, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { DEFAULT_GENERAL, DEFAULT_HISTORIA, DEFAULT_CURSOS } from '../data/contenidoDefaults';

const AdminDataContext = createContext(null);

export function AdminDataProvider({ children }) {
  const [cursos,        setCursos]        = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [pagos,         setPagos]         = useState([]);
  const [mensajes,      setMensajes]      = useState([]);
  const [contenido,     setContenido]     = useState({
    general:  DEFAULT_GENERAL,
    historia: DEFAULT_HISTORIA,
  });
  const [cargando, setCargando] = useState(true);

  // ── onSnapshot — todas las colecciones admin ──────────────────────────
  useEffect(() => {
    let ready = 0;
    const tick = () => { if (++ready >= 4) setCargando(false); };

    const unsubCursos = onSnapshot(
      query(collection(db, 'cursos'), orderBy('nombre')),
      (snap) => { setCursos(snap.docs.map((d) => ({ id: d.id, ...d.data() }))); tick(); },
      () => { setCursos(DEFAULT_CURSOS); tick(); }
    );

    const unsubInscrip = onSnapshot(
      query(collection(db, 'inscripciones'), orderBy('fecha', 'desc')),
      (snap) => { setInscripciones(snap.docs.map((d) => ({ id: d.id, ...d.data() }))); tick(); },
      () => tick()
    );

    const unsubPagos = onSnapshot(
      query(collection(db, 'pagos'), orderBy('fecha', 'desc')),
      (snap) => { setPagos(snap.docs.map((d) => ({ id: d.id, ...d.data() }))); tick(); },
      () => tick()
    );

    const unsubMensajes = onSnapshot(
      query(collection(db, 'mensajes'), orderBy('fecha', 'desc')),
      (snap) => { setMensajes(snap.docs.map((d) => ({ id: d.id, ...d.data() }))); tick(); },
      () => tick()
    );

    // Contenido público (general + historia)
    const unsubGeneral = onSnapshot(doc(db, 'contenido', 'general'), (snap) => {
      if (snap.exists()) setContenido((prev) => ({ ...prev, general: snap.data() }));
    });
    const unsubHistoria = onSnapshot(doc(db, 'contenido', 'historia'), (snap) => {
      if (snap.exists()) setContenido((prev) => ({ ...prev, historia: snap.data() }));
    });

    return () => {
      unsubCursos(); unsubInscrip(); unsubPagos();
      unsubMensajes(); unsubGeneral(); unsubHistoria();
    };
  }, []);

  // ════════════════════════════════════════════════════════════════════════
  // CURSOS
  // ════════════════════════════════════════════════════════════════════════

  const addCurso = useCallback(async (curso) => {
    const ref = await addDoc(collection(db, 'cursos'), {
      ...curso, creadoEn: serverTimestamp(),
    });
    return ref.id;
  }, []);

  const updateCurso = useCallback(async (id, updates) => {
    await updateDoc(doc(db, 'cursos', id), { ...updates, actualizadoEn: serverTimestamp() });
  }, []);

  const deleteCurso = useCallback(async (id) => {
    await deleteDoc(doc(db, 'cursos', id));
  }, []);

  // ════════════════════════════════════════════════════════════════════════
  // INSCRIPCIONES
  // ════════════════════════════════════════════════════════════════════════

  const addInscripcion = useCallback(async (inscripcion) => {
    await addDoc(collection(db, 'inscripciones'), {
      ...inscripcion,
      fecha:    new Date().toLocaleDateString('es-BO'),
      creadoEn: serverTimestamp(),
    });
  }, []);

  const updateInscripcion = useCallback(async (id, updates) => {
    await updateDoc(doc(db, 'inscripciones', id), updates);
  }, []);

  const deleteInscripcion = useCallback(async (id) => {
    await deleteDoc(doc(db, 'inscripciones', id));
  }, []);

  // ════════════════════════════════════════════════════════════════════════
  // PAGOS
  // ════════════════════════════════════════════════════════════════════════

  const addPago = useCallback(async (pago) => {
    await addDoc(collection(db, 'pagos'), {
      ...pago,
      fecha:    new Date().toLocaleDateString('es-BO'),
      creadoEn: serverTimestamp(),
    });
  }, []);

  const confirmarPago = useCallback(async (id) => {
    await updateDoc(doc(db, 'pagos', id), { estado: 'Pagado' });
  }, []);

  const deletePago = useCallback(async (id) => {
    await deleteDoc(doc(db, 'pagos', id));
  }, []);

  // ════════════════════════════════════════════════════════════════════════
  // MENSAJES
  // ════════════════════════════════════════════════════════════════════════

  const marcarMensajeLeido = useCallback(async (id) => {
    await updateDoc(doc(db, 'mensajes', id), { leido: true });
  }, []);

  const deleteMensaje = useCallback(async (id) => {
    await deleteDoc(doc(db, 'mensajes', id));
  }, []);

  // ════════════════════════════════════════════════════════════════════════
  // CONTENIDO PÚBLICO (General / Historia)
  // ════════════════════════════════════════════════════════════════════════

  const saveContenido = useCallback(async (tab, data) => {
    const id = tab.toLowerCase(); // 'general' o 'historia'
    await setDoc(doc(db, 'contenido', id), {
      ...data, updatedAt: serverTimestamp(),
    }, { merge: true });
  }, []);

  // ── Stats ─────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    cursos:        cursos.filter((c) => c.estado === 'Activo').length,
    usuarios:      0,           // se llena desde AuthContext
    inscripciones: inscripciones.length,
    mensajes:      mensajes.filter((m) => !m.leido).length,
    pagosTotal:    pagos.length,
    pagosPendientes: pagos.filter((p) => p.estado === 'Pendiente').length,
  }), [cursos, inscripciones, mensajes, pagos]);

  const value = useMemo(() => ({
    cursos, inscripciones, pagos, mensajes, contenido,
    stats, cargando,
    addCurso, updateCurso, deleteCurso,
    addInscripcion, updateInscripcion, deleteInscripcion,
    addPago, confirmarPago, deletePago,
    marcarMensajeLeido, deleteMensaje,
    saveContenido,
  }), [
    cursos, inscripciones, pagos, mensajes, contenido,
    stats, cargando,
    addCurso, updateCurso, deleteCurso,
    addInscripcion, updateInscripcion, deleteInscripcion,
    addPago, confirmarPago, deletePago,
    marcarMensajeLeido, deleteMensaje,
    saveContenido,
  ]);

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error('useAdminData debe usarse dentro de AdminDataProvider');
  return ctx;
}
