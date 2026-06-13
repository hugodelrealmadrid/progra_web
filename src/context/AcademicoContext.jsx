/**
 * AcademicoContext — Firestore tiempo real
 *
 * Colecciones:
 *   alumnos         { nombre, curso, tipo, estado, promedio, progreso }
 *   calificaciones  { nombre, curso, b1, b2, b3, b4, _timestamps, _ultimaEdicion }
 *   informes        { alumno, clase, contenido, observaciones, nota, fecha, curso }
 *   materiales      { titulo, curso, categoria, tamano, fecha }
 *
 * Cada onSnapshot propaga cambios a TODOS los clientes en tiempo real.
 */

import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import {
  collection, doc, addDoc, setDoc, updateDoc, deleteDoc,
  onSnapshot, query, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { CALIFICACIONES, CURSOS_INSCRITOS, MALLA } from '../data/estudianteMock';
import { CURSOS_PROFESOR } from '../data/profesorMock';
import { IMG } from '../data/images';

const AcademicoContext = createContext(null);

function promedio(notas) {
  const vals = [notas.b1, notas.b2, notas.b3, notas.b4].filter((v) => v != null && v !== '');
  if (!vals.length) return 0;
  return Math.round(vals.reduce((s, v) => Number(v) + s, 0) / vals.length);
}

function ahoraBO() {
  return new Date().toLocaleString('es-BO', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function AcademicoProvider({ children }) {
  const [alumnos,       setAlumnos]   = useState([]);
  const [calificaciones,setCalifs]    = useState({});
  const [informes,      setInformes]  = useState([]);
  const [materiales,    setMateriales]= useState([]);
  const [actividad,     setActividad] = useState([]);
  const [perfiles,      setPerfiles]  = useState({});
  const [toast,         setToast]     = useState('');
  const [cargando,      setCargando]  = useState(true);

  // ── Toast ──────────────────────────────────────────────────────────────
  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }, []);

  // ── onSnapshot: suscripciones en tiempo real ───────────────────────────
  useEffect(() => {
    let ready = 0;
    const tick = () => { if (++ready >= 3) setCargando(false); };

    // Alumnos
    const unsubA = onSnapshot(
      query(collection(db, 'alumnos'), orderBy('nombre')),
      (snap) => { setAlumnos(snap.docs.map((d) => ({ id: d.id, ...d.data() }))); tick(); },
      () => tick()
    );

    // Calificaciones → agrupadas por curso
    const unsubC = onSnapshot(
      collection(db, 'calificaciones'),
      (snap) => {
        const grupo = {};
        snap.docs.forEach((d) => {
          const data = { id: d.id, ...d.data() };
          const c    = data.curso ?? 'Sin curso';
          if (!grupo[c]) grupo[c] = [];
          grupo[c].push(data);
        });
        setCalifs(grupo);
        tick();
      },
      () => tick()
    );

    // Informes
    const unsubI = onSnapshot(
      query(collection(db, 'informes'), orderBy('fecha', 'desc')),
      (snap) => { setInformes(snap.docs.map((d) => ({ id: d.id, ...d.data() }))); tick(); },
      () => tick()
    );

    // Materiales
    const unsubM = onSnapshot(
      collection(db, 'materiales'),
      (snap) => setMateriales(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );

    return () => { unsubA(); unsubC(); unsubI(); unsubM(); };
  }, []);

  // ── Log de actividad (solo local, liviano) ────────────────────────────
  const addActividad = useCallback((actividad, curso, estado = 'Completado') => {
    setActividad((prev) => [{
      id: Date.now().toString(), actividad, curso, estado,
      fecha: new Date().toLocaleDateString('es-BO'),
    }, ...prev.slice(0, 19)]);
  }, []);

  // ════════════════════════════════════════════════════════════════════════
  // ALUMNOS
  // ════════════════════════════════════════════════════════════════════════

  const addAlumno = useCallback(async (alumno) => {
    await addDoc(collection(db, 'alumnos'), {
      nombre:   alumno.nombre,
      curso:    alumno.curso,
      tipo:     alumno.tipo    ?? 'Cátedra',
      estado:   alumno.estado  ?? 'Activo',
      promedio: 0,
      progreso: 30,
      avatar:   alumno.avatar  ?? IMG.ninos,
      creadoEn: serverTimestamp(),
    });
    addActividad(`Alumno agregado: ${alumno.nombre}`, alumno.curso, 'Nuevo');
    showToast('Alumno agregado correctamente');
  }, [addActividad, showToast]);

  const updateAlumno = useCallback(async (id, updates) => {
    await updateDoc(doc(db, 'alumnos', id), updates);
    showToast('Alumno actualizado');
  }, [showToast]);

  const deleteAlumno = useCallback(async (id) => {
    await deleteDoc(doc(db, 'alumnos', id));
    showToast('Alumno eliminado');
  }, [showToast]);

  // ════════════════════════════════════════════════════════════════════════
  // CALIFICACIONES
  // Cada alumno = un documento en "calificaciones" identificado por su id
  // ════════════════════════════════════════════════════════════════════════

  const saveCalificaciones = useCallback(async (curso, notas, timestamps) => {
    const ahora = ahoraBO();

    await Promise.all(notas.map((n) =>
      setDoc(doc(db, 'calificaciones', n.id), {
        nombre:         n.nombre,
        curso,
        b1:             n.b1 ?? null,
        b2:             n.b2 ?? null,
        b3:             n.b3 ?? null,
        b4:             n.b4 ?? null,
        _timestamps:    { ...(n._timestamps ?? {}), ...(timestamps?.[n.id] ?? {}) },
        _ultimaEdicion: ahora,
        avatar:         n.avatar ?? IMG.ninos,
      })
    ));

    // Actualizar promedio en alumnos
    await Promise.all(notas.map(async (n) => {
      const prom   = promedio(n);
      const alumno = alumnos.find((a) => a.nombre === n.nombre);
      if (alumno?.id) {
        await updateDoc(doc(db, 'alumnos', alumno.id), {
          promedio: prom || alumno.promedio,
          progreso: Math.min(100, prom),
        });
      }
    }));

    addActividad('Calificaciones guardadas', curso);
    showToast('Calificaciones guardadas correctamente');
  }, [alumnos, addActividad, showToast]);

  const deleteCalificacion = useCallback(async (id) => {
    await updateDoc(doc(db, 'calificaciones', id), {
      b1: null, b2: null, b3: null, b4: null,
    });
    showToast('Notas borradas');
  }, [showToast]);

  const exportCalificacionesCSV = useCallback((curso) => {
    const notas  = calificaciones[curso] ?? [];
    const header = 'Alumno,1° Bim,2° Bim,3° Bim,4° Bim,Promedio\n';
    const rows   = notas.map((n) =>
      `${n.nombre},${n.b1 ?? ''},${n.b2 ?? ''},${n.b3 ?? ''},${n.b4 ?? ''},${promedio(n)}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `calificaciones-${curso.replace(/\s/g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Archivo exportado');
  }, [calificaciones, showToast]);

  // ════════════════════════════════════════════════════════════════════════
  // INFORMES DE ESPECIALIDAD
  // ════════════════════════════════════════════════════════════════════════

  const addInforme = useCallback(async (informe) => {
    await addDoc(collection(db, 'informes'), {
      ...informe,
      fecha:    new Date().toLocaleDateString('es-BO'),
      creadoEn: serverTimestamp(),
    });
    addActividad('Informe creado', informe.curso ?? 'Especialidad');
    showToast('Informe creado');
  }, [addActividad, showToast]);

  const updateInforme = useCallback(async (id, updates) => {
    await updateDoc(doc(db, 'informes', id), updates);
    showToast('Informe actualizado');
  }, [showToast]);

  const deleteInforme = useCallback(async (id) => {
    await deleteDoc(doc(db, 'informes', id));
    showToast('Informe eliminado');
  }, [showToast]);

  // ════════════════════════════════════════════════════════════════════════
  // MATERIALES
  // ════════════════════════════════════════════════════════════════════════

  const addMaterial = useCallback(async (material) => {
    await addDoc(collection(db, 'materiales'), {
      ...material,
      fecha:    new Date().toLocaleDateString('es-BO', { day: '2-digit', month: 'short' }),
      tamano:   material.tamano ?? '1.0 MB',
      creadoEn: serverTimestamp(),
    });
    addActividad('Material subido', material.curso, 'Nuevo');
    showToast('Material subido correctamente');
  }, [addActividad, showToast]);

  const deleteMaterial = useCallback(async (id) => {
    await deleteDoc(doc(db, 'materiales', id));
    showToast('Material eliminado');
  }, [showToast]);

  const downloadMaterial = useCallback((material) => {
    const blob = new Blob(
      [`Material AMC — ${material.titulo}\nCurso: ${material.curso}`],
      { type: 'text/plain' }
    );
    const url = URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href    = url;
    a.download = material.titulo.replace('.pdf', '.txt');
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Descargando ${material.titulo}`);
  }, [showToast]);

  // ════════════════════════════════════════════════════════════════════════
  // PERFILES ESTUDIANTE (local — sin colección extra)
  // ════════════════════════════════════════════════════════════════════════

  const updatePerfilEstudiante = useCallback((email, updates) => {
    setPerfiles((prev) => ({ ...prev, [email]: { ...(prev[email] ?? {}), ...updates } }));
    showToast('Perfil actualizado');
  }, [showToast]);

  const getPerfilEstudiante = useCallback((email, user) => ({
    especialidad: 'Piano Clásico',
    fechaIngreso: '15/02/2025',
    telefono:     '',
    avatar:       user?.avatar ?? IMG.piano,
    ...(perfiles[email] ?? {}),
  }), [perfiles]);

  // ════════════════════════════════════════════════════════════════════════
  // QUERIES DERIVADAS
  // ════════════════════════════════════════════════════════════════════════

  const getCalificacionesEstudiante = useCallback((nombre) => {
    const todas     = Object.values(calificaciones).flat();
    const delAlumno = todas.filter((n) => n.nombre === nombre);
    return delAlumno.length
      ? delAlumno.map((n) => ({ materia: n.curso, b1: n.b1 ?? '—', b2: n.b2 ?? '—', b3: n.b3 ?? '—', b4: n.b4 ?? '—' }))
      : CALIFICACIONES;
  }, [calificaciones]);

  const getInformesEstudiante = useCallback((nombre) =>
    informes.filter((i) => i.alumno === nombre)
  , [informes]);

  const getNotasAlumno = useCallback((nombre) =>
    Object.entries(calificaciones).flatMap(([curso, notas]) => {
      const n = notas.find((x) => x.nombre === nombre);
      return n ? [{ curso, ...n, promedio: promedio(n) }] : [];
    })
  , [calificaciones]);

  // ── Stats ─────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    cursos:             CURSOS_PROFESOR.length,
    alumnos:            alumnos.length,
    activos:            alumnos.filter((a) => a.estado === 'Activo').length,
    pendientes:         alumnos.filter((a) => a.estado === 'Pendiente').length,
    calificaciones:     Object.values(calificaciones).flat().length,
    materiales:         materiales.length,
    informesPendientes: informes.length,
  }), [alumnos, calificaciones, materiales, informes]);

  const value = useMemo(() => ({
    alumnos, calificaciones, informes, materiales, actividad, perfiles,
    cursosProfesor:   CURSOS_PROFESOR,
    cursosEstudiante: CURSOS_INSCRITOS,
    malla:            MALLA,
    stats, toast, cargando,
    addAlumno, updateAlumno, deleteAlumno,
    saveCalificaciones, deleteCalificacion, exportCalificacionesCSV,
    addInforme, updateInforme, deleteInforme,
    addMaterial, deleteMaterial, downloadMaterial,
    updatePerfilEstudiante, getPerfilEstudiante,
    getCalificacionesEstudiante, getInformesEstudiante, getNotasAlumno,
    promedio, showToast,
  }), [
    alumnos, calificaciones, informes, materiales, actividad, perfiles,
    stats, toast, cargando,
    addAlumno, updateAlumno, deleteAlumno,
    saveCalificaciones, deleteCalificacion, exportCalificacionesCSV,
    addInforme, updateInforme, deleteInforme,
    addMaterial, deleteMaterial, downloadMaterial,
    updatePerfilEstudiante, getPerfilEstudiante,
    getCalificacionesEstudiante, getInformesEstudiante, getNotasAlumno,
    showToast,
  ]);

  return <AcademicoContext.Provider value={value}>{children}</AcademicoContext.Provider>;
}

export function useAcademico() {
  const ctx = useContext(AcademicoContext);
  if (!ctx) throw new Error('useAcademico debe usarse dentro de AcademicoProvider');
  return ctx;
}
