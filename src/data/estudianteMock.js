import { IMG } from './images';

export const PERFIL_ESTUDIANTE = {
  nombre: 'Juan Pérez',
  correo: 'juan@gmail.com',
  especialidad: 'Piano Clásico',
  fechaIngreso: '15/02/2025',
  avatar: IMG.piano,
};

export const CURSOS_INSCRITOS = [
  { nombre: 'Piano Intermedio', profesor: 'Carlos Rojas', horario: 'Lunes y Miércoles', img: IMG.piano },
  { nombre: 'Teoría Musical', profesor: 'Ana Méndez', horario: 'Martes y Jueves', img: IMG.guitarra },
  { nombre: 'Orquesta Juvenil', profesor: 'Luis Vargas', horario: 'Viernes', img: IMG.orquesta },
];

export const CALIFICACIONES = [
  { materia: 'Piano', b1: 85, b2: 88, b3: 90, b4: 92 },
  { materia: 'Teoría Musical', b1: 78, b2: 82, b3: 80, b4: 85 },
  { materia: 'Lectura Musical', b1: 90, b2: 88, b3: 91, b4: 89 },
];

export const MATERIALES = [
  'Método de Piano Nivel Intermedio.pdf',
  'Teoría Musical — Bimestre 1.pdf',
  'Partituras Orquesta Juvenil.pdf',
  'Ejercicios de Lectura Musical.pdf',
];

export const HORARIO = [
  { hora: '08:00 - 09:30', lun: 'Piano', mar: '', mie: 'Piano', jue: 'Teoría', vie: '' },
  { hora: '10:00 - 11:30', lun: '', mar: 'Teoría', mie: '', jue: '', vie: 'Orquesta' },
  { hora: '14:00 - 15:30', lun: '', mar: 'Lectura', mie: '', jue: 'Lectura', vie: '' },
];

export const MALLA = {
  niveles: ['1° Nivel', '2° Nivel', '3° Nivel', '4° Nivel'],
  materias: [
    ['Lenguaje Musical I', 'Armonía I', 'Historia de la Música', '—'],
    ['Piano I', 'Piano II', 'Piano III', 'Piano IV'],
    ['Teoría Musical', 'Lectura Musical', 'Orquesta I', 'Orquesta II'],
  ],
  estados: [
    ['aprobada', 'aprobada', 'cursando', 'bloqueada'],
    ['aprobada', 'cursando', 'disponible', 'bloqueada'],
    ['cursando', 'disponible', 'bloqueada', 'bloqueada'],
  ],
};
