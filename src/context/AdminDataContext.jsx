import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { IMG } from '../data/images';
import { syncCurso, removeCurso } from '../services/contenidoService';
import { DEFAULT_CURSOS } from '../data/contenidoDefaults';

const AdminDataContext = createContext(null);
const DATA_KEY = 'amc_admin_data';

const INITIAL = {
  cursos: DEFAULT_CURSOS.map((c) => ({ ...c })),
  inscripciones: [
    { id: '1', estudiante: 'Flores Viza', curso: 'Piano Forte', nivel: 'Medio', fecha: '05/03/2024', pago: 'Pagado', estado: 'Confirmado', avatar: IMG.piano },
    { id: '2', estudiante: 'María López', curso: 'Violín Clásico', nivel: 'Medio', fecha: '06/03/2024', pago: 'Pendiente', estado: 'En revisión', avatar: IMG.violin },
  ],
  pagos: [
    { id: '1', estudiante: 'Flores Viza', curso: 'Piano Forte', monto: 'Bs. 350', fecha: '05/03/2026', metodo: 'Transferencia', estado: 'Pagado', avatar: IMG.piano },
    { id: '2', estudiante: 'María López', curso: 'Violín', monto: 'Bs. 350', fecha: '08/03/2026', metodo: 'Efectivo', estado: 'Pendiente', avatar: IMG.violin },
  ],
  mensajes: [
    { id: '1', fecha: '10/03/2026', nombre: 'Juan Pérez', email: 'juan@email.com', asunto: 'Consulta inscripción', mensaje: 'Quisiera saber los requisitos para inscribirme en piano.', leido: false, avatar: IMG.ninos },
    { id: '2', fecha: '08/03/2026', nombre: 'Ana Torres', email: 'ana@email.com', asunto: 'Horarios violín', mensaje: '¿Cuáles son los horarios del nivel medio?', leido: true, avatar: IMG.coro },
  ],
  contenido: {
    General: { titulo: 'Conoce la Convocatoria 2024', subtitulo: 'Inscríbete en la Academia de Música Man Césped', boton: 'Cronograma', imagen: IMG.edificio },
    Historia: { titulo: 'Historia y Recorrido', subtitulo: 'Conoce el camino de la academia', boton: 'Leer más', imagen: IMG.edificio },
    Ofertas: { titulo: 'Oferta Académica', subtitulo: 'Formando músicos desde 1940', boton: 'Ver niveles', imagen: IMG.orquesta },
    Contacto: { titulo: 'Contacto Principal', subtitulo: 'Estamos para atenderte', boton: 'Enviar', imagen: IMG.edificio },
  },
};

function loadData() {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return INITIAL;
}

let nextId = 100;

export function AdminDataProvider({ children }) {
  const [data, setData] = useState(loadData);

  useEffect(() => {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  }, [data]);

  const stats = useMemo(
    () => ({
      cursos: data.cursos.filter((c) => c.estado === 'Activo').length,
      usuarios: 156,
      inscripciones: data.inscripciones.length,
      mensajes: data.mensajes.filter((m) => !m.leido).length,
    }),
    [data]
  );

  const addCurso = (curso) => {
    const id = curso.codigo || String(++nextId);
    const payload = {
      ...curso,
      id,
      codigo: curso.codigo || id,
      descripcion: curso.descripcion || '',
      destacado: curso.destacado ?? true,
    };
    setData((d) => ({ ...d, cursos: [...d.cursos, payload] }));
    syncCurso(payload);
    return id;
  };

  const updateCurso = (id, curso) => {
    const payload = {
      ...curso,
      id,
      codigo: curso.codigo || id,
      descripcion: curso.descripcion || '',
      destacado: curso.destacado ?? true,
    };
    setData((d) => ({
      ...d,
      cursos: d.cursos.map((c) => (c.id === id ? { ...c, ...payload } : c)),
    }));
    syncCurso(payload);
  };

  const deleteCurso = (id) => {
    setData((d) => ({ ...d, cursos: d.cursos.filter((c) => c.id !== id) }));
    removeCurso(id);
  };

  const confirmarPago = (id) => {
    setData((d) => ({
      ...d,
      pagos: d.pagos.map((p) => (p.id === id ? { ...p, estado: 'Pagado' } : p)),
    }));
  };

  const addPago = (pago) => {
    const id = String(++nextId);
    setData((d) => ({ ...d, pagos: [...d.pagos, { ...pago, id }] }));
  };

  const marcarMensajeLeido = (id) => {
    setData((d) => ({
      ...d,
      mensajes: d.mensajes.map((m) => (m.id === id ? { ...m, leido: true } : m)),
    }));
  };

  const saveContenido = (tab, contenido) => {
    setData((d) => ({
      ...d,
      contenido: { ...d.contenido, [tab]: { ...d.contenido[tab], ...contenido } },
    }));
  };

  const value = useMemo(
    () => ({
      ...data,
      stats,
      addCurso,
      updateCurso,
      deleteCurso,
      confirmarPago,
      addPago,
      marcarMensajeLeido,
      saveContenido,
    }),
    [data, stats]
  );

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error('useAdminData debe usarse dentro de AdminDataProvider');
  return ctx;
}
