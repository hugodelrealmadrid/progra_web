import { IMG } from './images';

export const PERFIL_PROFESOR = {
  nombre: 'María Pérez',
  rol: 'Docente',
  avatar: IMG.guitarra,
};

export const STATS_PROFESOR = [
  { label: 'Cursos Asignados', value: '3', sub: '2 colectivos · 1 especialidad' },
  { label: 'Alumnos Inscritos', value: '72', sub: '68 activos · 4 pendientes' },
  { label: 'Calificaciones', value: '48', sub: '14 pendientes esta semana' },
  { label: 'Materiales Subidos', value: '12', sub: 'Última subida hace 2 días' },
];

export const CURSOS_PROFESOR = [
  { id: '1', nombre: 'Piano Básico', tipo: 'Colectivo', horario: 'Lunes y Miércoles', alumnos: 35, duracion: '4 Semestres', img: IMG.piano, color: 'border-amber-400' },
  { id: '2', nombre: 'Violín Intermedio', tipo: 'Colectivo', horario: 'Martes y Jueves', alumnos: 18, duracion: '6 Semestres', img: IMG.violin, color: 'border-amc-acento' },
  { id: '3', nombre: 'Piano Avanzado', tipo: 'Especialidad', horario: 'Clases individuales', alumnos: 12, duracion: '14 Sesiones', img: IMG.piano, color: 'border-blue-400' },
];

export const ACTIVIDAD = [
  { actividad: 'Calificaciones registradas', curso: 'Piano Básico', fecha: '10/03/2026', estado: 'Completado' },
  { actividad: 'Informe de especialidad', curso: 'Piano Avanzado', fecha: '09/03/2026', estado: 'Pendiente' },
  { actividad: 'Material subido', curso: 'Violín Intermedio', fecha: '08/03/2026', estado: 'Nuevo' },
];

export const ALUMNOS = [
  { nombre: 'Ana Torres', curso: 'Piano Avanzado', tipo: 'Especialidad', promedio: 93, progreso: 95, estado: 'Activo', avatar: IMG.violin },
  { nombre: 'Juan Pérez', curso: 'Piano Básico', tipo: 'Cátedra', promedio: 82, progreso: 70, estado: 'Activo', avatar: IMG.piano },
  { nombre: 'Sofía Ramírez', curso: 'Violín Intermedio', tipo: 'Cátedra', promedio: 88, progreso: 85, estado: 'Activo', avatar: IMG.coro },
  { nombre: 'Diego Flores', curso: 'Piano Avanzado', tipo: 'Especialidad', promedio: 89, progreso: 80, estado: 'Pendiente', avatar: IMG.ninos },
];

export const CALIFICACIONES_ALUMNOS = [
  { nombre: 'Juan Pérez', b1: 85, b2: 88, b3: null, b4: null, avatar: IMG.piano },
  { nombre: 'Sofía Ramírez', b1: 90, b2: 92, b3: null, b4: null, avatar: IMG.coro },
  { nombre: 'Ana Torres', b1: 78, b2: 82, b3: null, b4: null, avatar: IMG.violin },
  { nombre: 'Diego Flores', b1: 55, b2: 62, b3: null, b4: null, avatar: IMG.ninos },
];

export const INFORMES = [
  { alumno: 'Ana Torres', clase: 'Clase 10', contenido: 'Escalas y arpegios', observaciones: 'Excelente progreso', nota: 93, fecha: '10/03/2026', avatar: IMG.violin },
  { alumno: 'Suelly Mendoza', clase: 'Clase 9', contenido: 'Sonata K.545', observaciones: 'Mejorar ritmo', nota: 90, fecha: '08/03/2026', avatar: IMG.piano },
  { alumno: 'Diego Flores', clase: 'Clase 8', contenido: 'Estudio Op.10', observaciones: 'Practicar mano izq.', nota: 89, fecha: '05/03/2026', avatar: IMG.ninos },
];

export const MATERIALES_PROFESOR = [
  { titulo: 'Hanon — Los Pianistas Virtuosos.pdf', curso: 'Piano Básico', categoria: 'Partitura', tamano: '4.2 MB', fecha: '21 may' },
  { titulo: 'Escalas Mayores y Menores.pdf', curso: 'Piano Avanzado', categoria: 'Ejercicio', tamano: '1.8 MB', fecha: '15 may' },
  { titulo: 'Teoría Musical — Bimestre 1.pdf', curso: 'Violín Intermedio', categoria: 'Teoría', tamano: '2.5 MB', fecha: '10 may' },
];
