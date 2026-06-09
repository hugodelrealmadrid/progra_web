import { IMG } from './images';

export const ADMIN_STATS = [
  { label: 'Cursos activos', value: 24, img: IMG.piano },
  { label: 'Usuarios', value: 156, img: IMG.director },
  { label: 'Inscripciones', value: 89, img: IMG.orquesta },
  { label: 'Mensajes nuevos', value: 12, img: IMG.concierto },
];

export const INSCRIPCIONES_RECIENTES = [
  { estudiante: 'Flores Viza', curso: 'Piano Forte', fecha: '05/03/2024', pago: 'Pagado', estado: 'Confirmada', avatar: IMG.piano },
  { estudiante: 'María López', curso: 'Violín Clásico', fecha: '06/03/2024', pago: 'Pendiente', estado: 'En revisión', avatar: IMG.violin },
];

export const CURSOS = [
  { codigo: 'PIANO-01', nombre: 'Piano Forte', nivel: 'Medio', profesor: 'Prof. García', cupos: '15/20', estado: 'Activo', img: IMG.piano },
  { codigo: 'VIOL-01', nombre: 'Violín Clásico', nivel: 'Medio', profesor: 'Prof. Ríos', cupos: '8/12', estado: 'Activo', img: IMG.violin },
];

export const USUARIOS = [
  { nombre: 'Emily Condori', email: 'emily@admin.amc.bo', rol: 'Administrador', estado: 'Activo', registro: '01/01/2024', avatar: IMG.director },
  { nombre: 'Hugo Delgado', email: 'hugo@profesor.amc.bo', rol: 'Profesor', estado: 'Activo', registro: '15/02/2024', avatar: IMG.guitarra },
  { nombre: 'Flores Viza', email: 'flores@estudiante.amc.bo', rol: 'Estudiante', estado: 'Activo', registro: '20/02/2024', avatar: IMG.violin },
];

export const INSCRIPCIONES = [
  { estudiante: 'Flores Viza', curso: 'Piano Forte', nivel: 'Medio', fecha: '05/03/2024', pago: 'Pagado', estado: 'Confirmado', avatar: IMG.piano },
  { estudiante: 'María López', curso: 'Violín Clásico', nivel: 'Medio', fecha: '06/03/2024', pago: 'Pendiente', estado: 'En revisión', avatar: IMG.violin },
];

export const PAGOS = [
  { estudiante: 'Flores Viza', curso: 'Piano Forte', monto: 'Bs. 350', fecha: '05/03/2026', metodo: 'Transferencia', estado: 'Pagado', avatar: IMG.piano },
  { estudiante: 'María López', curso: 'Violín', monto: 'Bs. 350', fecha: '08/03/2026', metodo: 'Efectivo', estado: 'Pendiente', avatar: IMG.violin },
];

export const MENSAJES = [
  { fecha: '10/03/2026', nombre: 'Juan Pérez', email: 'juan@email.com', asunto: 'Consulta inscripción', leido: false, avatar: IMG.ninos },
  { fecha: '08/03/2026', nombre: 'Ana Torres', email: 'ana@email.com', asunto: 'Horarios violín', leido: true, avatar: IMG.coro },
];

export const CONTENIDO_TABS = ['General', 'Historia', 'Ofertas', 'Contacto'];

export const CONTENIDO_GENERAL = {
  titulo: 'Conoce la Convocatoria 2024',
  subtitulo: 'Inscríbete en la Academia de Música Man Césped',
  boton: 'Cronograma',
  imagen: IMG.edificio,
};
