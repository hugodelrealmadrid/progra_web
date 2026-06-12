import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { IMG } from '../data/images';
import {
  ALUMNOS,
  CALIFICACIONES_ALUMNOS,
  INFORMES,
  MATERIALES_PROFESOR,
  ACTIVIDAD,
  CURSOS_PROFESOR,
} from '../data/profesorMock';
import { PERFIL_ESTUDIANTE, CURSOS_INSCRITOS, CALIFICACIONES, MALLA } from '../data/estudianteMock';

const STORAGE_KEY = 'amc_academico_data';

let uid = 200;

const genId = () => String(++uid);

const INITIAL = {
  alumnos: [
    ...ALUMNOS.map((a) => ({ ...a, id: genId() })),
    { id: genId(), nombre: 'Flores Viza', curso: 'Violín Intermedio', tipo: 'Cátedra', promedio: 84, progreso: 78, estado: 'Activo', avatar: IMG.violin },
  ],
  calificaciones: {
    'Piano Básico': CALIFICACIONES_ALUMNOS.map((c) => ({ ...c, id: genId(), curso: 'Piano Básico' })),
    'Violín Intermedio': [
      { id: genId(), nombre: 'Sofía Ramírez', b1: 88, b2: 90, b3: null, b4: null, avatar: IMG.coro, curso: 'Violín Intermedio' },
      { id: genId(), nombre: 'Flores Viza', b1: 82, b2: 85, b3: 87, b4: null, avatar: IMG.violin, curso: 'Violín Intermedio' },
    ],
  },
  informes: INFORMES.map((i) => ({ ...i, id: genId() })),
  materiales: MATERIALES_PROFESOR.map((m) => ({ ...m, id: genId() })),
  actividad: ACTIVIDAD.map((a) => ({ ...a, id: genId() })),
  perfiles: {
    'flores@estudiante.amc.bo': {
      especialidad: 'Violín Clásico',
      fechaIngreso: '20/02/2025',
      telefono: '70123456',
      avatar: IMG.violin,
    },
    'juan@gmail.com': { ...PERFIL_ESTUDIANTE, telefono: '70987654' },
  },
  cursosEstudiante: CURSOS_INSCRITOS,
  malla: MALLA,
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return INITIAL;
}

function promedio(notas) {
  const vals = [notas.b1, notas.b2, notas.b3, notas.b4].filter((v) => v != null && v !== '');
  if (!vals.length) return 0;
  return Math.round(vals.reduce((s, v) => Number(v) + s, 0) / vals.length);
}

const AcademicoContext = createContext(null);

export function AcademicoProvider({ children }) {
  const [data, setData] = useState(load);
  const [toast, setToast] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // ── Polling: sincroniza calificaciones desde localStorage cada 2s (simula onSnapshot) ──
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setData((prev) => {
            if (JSON.stringify(prev.calificaciones) !== JSON.stringify(parsed.calificaciones)) {
              return parsed;
            }
            return prev;
          });
        }
      } catch { /* ignore */ }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }, []);

  const addActividad = useCallback((actividad, curso, estado = 'Completado') => {
    const item = {
      id: genId(),
      actividad,
      curso,
      fecha: new Date().toLocaleDateString('es-BO'),
      estado,
    };
    setData((d) => ({ ...d, actividad: [item, ...d.actividad] }));
  }, []);

  const addAlumno = useCallback(
    (alumno) => {
      const nuevo = { ...alumno, id: genId(), progreso: alumno.progreso ?? 50, promedio: alumno.promedio ?? 0 };
      setData((d) => ({ ...d, alumnos: [...d.alumnos, nuevo] }));
      addActividad(`Alumno agregado: ${alumno.nombre}`, alumno.curso, 'Nuevo');
      showToast('Alumno agregado correctamente');
      return nuevo;
    },
    [addActividad, showToast]
  );

  const updateAlumno = useCallback((id, updates) => {
    setData((d) => ({
      ...d,
      alumnos: d.alumnos.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }));
    showToast('Alumno actualizado');
  }, [showToast]);

  const saveCalificaciones = useCallback(
    (curso, notas, timestamps) => {
      const ahora = new Date().toLocaleString('es-BO', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
      const notasConTimestamp = notas.map((n) => ({
        ...n,
        _timestamps: {
          ...(n._timestamps ?? {}),
          ...(timestamps?.[n.id] ?? {}),
        },
        _ultimaEdicion: ahora,
      }));
      setData((d) => {
        const updatedAlumnos = d.alumnos.map((a) => {
          const nota = notasConTimestamp.find((n) => n.nombre === a.nombre && n.curso === curso);
          if (!nota) return a;
          const prom = promedio(nota);
          return { ...a, promedio: prom || a.promedio, progreso: Math.min(100, prom) };
        });
        return {
          ...d,
          calificaciones: { ...d.calificaciones, [curso]: notasConTimestamp },
          alumnos: updatedAlumnos,
        };
      });
      addActividad('Calificaciones guardadas', curso);
      showToast('Calificaciones guardadas correctamente');
    },
    [addActividad, showToast]
  );

  const exportCalificacionesCSV = useCallback(
    (curso) => {
      const notas = data.calificaciones[curso] ?? [];
      const header = 'Alumno,1° Bim,2° Bim,3° Bim,4° Bim,Promedio\n';
      const rows = notas
        .map((n) => `${n.nombre},${n.b1 ?? ''},${n.b2 ?? ''},${n.b3 ?? ''},${n.b4 ?? ''},${promedio(n)}`)
        .join('\n');
      const blob = new Blob([header + rows], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `calificaciones-${curso.replace(/\s/g, '-')}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Archivo exportado');
    },
    [data.calificaciones, showToast]
  );

  const addInforme = useCallback(
    (informe) => {
      const nuevo = { ...informe, id: genId(), fecha: new Date().toLocaleDateString('es-BO') };
      setData((d) => ({ ...d, informes: [nuevo, ...d.informes] }));
      addActividad('Informe de especialidad creado', 'Piano Avanzado');
      showToast('Informe creado');
    },
    [addActividad, showToast]
  );

  const updateInforme = useCallback(
    (id, updates) => {
      setData((d) => ({
        ...d,
        informes: d.informes.map((i) => (i.id === id ? { ...i, ...updates } : i)),
      }));
      showToast('Informe actualizado');
    },
    [showToast]
  );

  const deleteInforme = useCallback(
    (id) => {
      setData((d) => ({ ...d, informes: d.informes.filter((i) => i.id !== id) }));
      showToast('Informe eliminado');
    },
    [showToast]
  );

  const addMaterial = useCallback(
    (material) => {
      const nuevo = {
        ...material,
        id: genId(),
        fecha: new Date().toLocaleDateString('es-BO', { day: '2-digit', month: 'short' }),
        tamano: material.tamano ?? '1.0 MB',
      };
      setData((d) => ({ ...d, materiales: [nuevo, ...d.materiales] }));
      addActividad('Material subido', material.curso, 'Nuevo');
      showToast('Material subido correctamente');
    },
    [addActividad, showToast]
  );

  const deleteMaterial = useCallback(
    (id) => {
      setData((d) => ({ ...d, materiales: d.materiales.filter((m) => m.id !== id) }));
      showToast('Material eliminado');
    },
    [showToast]
  );

  const downloadMaterial = useCallback(
    (material) => {
      const contenido = `Material AMC — ${material.titulo}\nCurso: ${material.curso}\nCategoría: ${material.categoria}`;
      const blob = new Blob([contenido], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = material.titulo.endsWith('.pdf') ? material.titulo.replace('.pdf', '.txt') : material.titulo;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`Descargando ${material.titulo}`);
    },
    [showToast]
  );

  const updatePerfilEstudiante = useCallback(
    (email, updates) => {
      setData((d) => ({
        ...d,
        perfiles: {
          ...d.perfiles,
          [email]: { ...(d.perfiles[email] ?? {}), ...updates },
        },
      }));
      showToast('Perfil actualizado');
    },
    [showToast]
  );

  const getPerfilEstudiante = useCallback(
    (email, user) => ({
      especialidad: 'Piano Clásico',
      fechaIngreso: '15/02/2025',
      telefono: '',
      avatar: user?.avatar ?? IMG.piano,
      ...(data.perfiles[email] ?? {}),
    }),
    [data.perfiles]
  );

  const getCalificacionesEstudiante = useCallback(
    (nombre) => {
      const todas = Object.values(data.calificaciones).flat();
      const delAlumno = todas.filter((n) => n.nombre === nombre);
      if (delAlumno.length) {
        return delAlumno.map((n) => ({
          materia: n.curso,
          b1: n.b1 ?? '—',
          b2: n.b2 ?? '—',
          b3: n.b3 ?? '—',
          b4: n.b4 ?? '—',
        }));
      }
      return CALIFICACIONES;
    },
    [data.calificaciones]
  );

  const getInformesEstudiante = useCallback(
    (nombre) =>
      data.informes
        .filter((inf) => inf.alumno === nombre)
        .sort((a, b) => new Date(b.fecha.split('/').reverse().join('-')) - new Date(a.fecha.split('/').reverse().join('-'))),
    [data.informes]
  );

  const getNotasAlumno = useCallback(
    (nombre) => Object.entries(data.calificaciones).flatMap(([curso, notas]) => {
      const n = notas.find((x) => x.nombre === nombre);
      return n ? [{ curso, ...n, promedio: promedio(n) }] : [];
    }),
    [data.calificaciones]
  );

  const stats = useMemo(() => {
    const activos = data.alumnos.filter((a) => a.estado === 'Activo').length;
    const pendientes = data.alumnos.filter((a) => a.estado === 'Pendiente').length;
    const colectivos = CURSOS_PROFESOR.filter((c) => c.tipo === 'Colectivo').length;
    const especialidad = CURSOS_PROFESOR.filter((c) => c.tipo === 'Especialidad').length;
    const totalNotas = Object.values(data.calificaciones).flat().length;
    return {
      cursos: CURSOS_PROFESOR.length,
      alumnos: data.alumnos.length,
      activos,
      pendientes,
      colectivos,
      especialidad,
      calificaciones: totalNotas,
      materiales: data.materiales.length,
      informesPendientes: data.informes.length,
    };
  }, [data]);

  const value = useMemo(
    () => ({
      ...data,
      stats,
      toast,
      cursosProfesor: CURSOS_PROFESOR,
      addAlumno,
      updateAlumno,
      saveCalificaciones,
      exportCalificacionesCSV,
      addInforme,
      updateInforme,
      deleteInforme,
      addMaterial,
      deleteMaterial,
      downloadMaterial,
      updatePerfilEstudiante,
      getPerfilEstudiante,
      getCalificacionesEstudiante,
      getNotasAlumno,
      getInformesEstudiante,
      promedio,
      showToast,
    }),
    [
      data,
      stats,
      toast,
      addAlumno,
      updateAlumno,
      saveCalificaciones,
      exportCalificacionesCSV,
      addInforme,
      updateInforme,
      deleteInforme,
      addMaterial,
      deleteMaterial,
      downloadMaterial,
      updatePerfilEstudiante,
      getPerfilEstudiante,
      getCalificacionesEstudiante,
      getNotasAlumno,
      getInformesEstudiante,
      showToast,
    ]
  );

  return <AcademicoContext.Provider value={value}>{children}</AcademicoContext.Provider>;
}

export function useAcademico() {
  const ctx = useContext(AcademicoContext);
  if (!ctx) throw new Error('useAcademico debe usarse dentro de AcademicoProvider');
  return ctx;
}
