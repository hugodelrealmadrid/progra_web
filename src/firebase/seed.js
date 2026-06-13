/**
 * seed.js — Poblar Firestore con datos iniciales
 *
 * Ejecutar UNA SOLA VEZ desde la consola del navegador o desde un
 * script Node (con firebase-admin) para tener datos de arranque.
 *
 * Desde el navegador (en tu app React):
 *   import { seedFirestore } from './firebase/seed';
 *   seedFirestore();          // llama esto una vez, luego borra la llamada
 */

import {
  collection, doc, setDoc, getDocs, writeBatch,
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { db, auth } from './config';

// ── Usuarios de prueba ─────────────────────────────────────────────────────
const USUARIOS_SEED = [
  { uid: null, nombre: 'Emily Condori',  email: 'emily@admin.amc.bo',      password: 'demo1234', rol: 'admin',      activo: true },
  { uid: null, nombre: 'Hugo Delgado',   email: 'hugo@profesor.amc.bo',    password: 'demo1234', rol: 'profesor',   activo: true },
  { uid: null, nombre: 'Flores Viza',    email: 'flores@estudiante.amc.bo', password: 'demo1234', rol: 'estudiante', activo: true },
  { uid: null, nombre: 'María López',    email: 'maria@estudiante.amc.bo',  password: 'demo1234', rol: 'estudiante', activo: true },
];

// ── Cursos ─────────────────────────────────────────────────────────────────
const CURSOS_SEED = [
  { id: 'PIANO-01',  nombre: 'Piano Forte',       nivel: 'Básico',   instrumento: 'Piano',  precio: 350, cupos: 20, inscritos: 15, estado: 'Activo',    tipo: 'Colectivo',    descripcion: 'Iniciación al piano clásico.' },
  { id: 'VIOL-01',   nombre: 'Violín Clásico',    nivel: 'Medio',    instrumento: 'Violín', precio: 380, cupos: 12, inscritos: 8,  estado: 'Activo',    tipo: 'Colectivo',    descripcion: 'Técnica intermedia de violín.' },
  { id: 'PIANO-02',  nombre: 'Piano Avanzado',    nivel: 'Avanzado', instrumento: 'Piano',  precio: 420, cupos: 10, inscritos: 7,  estado: 'Activo',    tipo: 'Especialidad', descripcion: 'Repertorio avanzado y técnica.' },
  { id: 'TEORIA-01', nombre: 'Teoría Musical',    nivel: 'Básico',   instrumento: 'Teoría', precio: 280, cupos: 25, inscritos: 20, estado: 'Activo',    tipo: 'Colectivo',    descripcion: 'Fundamentos de lenguaje musical.' },
  { id: 'GUITA-01',  nombre: 'Guitarra Clásica',  nivel: 'Básico',   instrumento: 'Guitarra',precio:320, cupos: 15, inscritos: 12, estado: 'Activo',    tipo: 'Colectivo',    descripcion: 'Introducción a la guitarra.' },
  { id: 'CANTO-01',  nombre: 'Canto Coral',       nivel: 'Medio',    instrumento: 'Voz',    precio: 300, cupos: 30, inscritos: 22, estado: 'Inactivo',  tipo: 'Colectivo',    descripcion: 'Técnica vocal y repertorio coral.' },
];

// ── Alumnos (del profesor Hugo) ────────────────────────────────────────────
const ALUMNOS_SEED = [
  { nombre: 'Juan Pérez',    curso: 'Piano Forte',    tipo: 'Cátedra',      estado: 'Activo',   promedio: 87, progreso: 75 },
  { nombre: 'Sofía Ramírez', curso: 'Piano Forte',    tipo: 'Cátedra',      estado: 'Activo',   promedio: 91, progreso: 85 },
  { nombre: 'Ana Torres',    curso: 'Piano Avanzado', tipo: 'Especialidad', estado: 'Activo',   promedio: 93, progreso: 95 },
  { nombre: 'Diego Flores',  curso: 'Piano Avanzado', tipo: 'Especialidad', estado: 'Pendiente',promedio: 72, progreso: 60 },
  { nombre: 'Flores Viza',   curso: 'Violín Clásico', tipo: 'Cátedra',      estado: 'Activo',   promedio: 84, progreso: 78 },
  { nombre: 'María López',   curso: 'Violín Clásico', tipo: 'Cátedra',      estado: 'Activo',   promedio: 79, progreso: 65 },
];

// ── Calificaciones ─────────────────────────────────────────────────────────
const CALIFS_SEED = [
  { nombre: 'Juan Pérez',    curso: 'Piano Forte',    b1: 85, b2: 88, b3: null, b4: null },
  { nombre: 'Sofía Ramírez', curso: 'Piano Forte',    b1: 90, b2: 92, b3: null, b4: null },
  { nombre: 'Ana Torres',    curso: 'Piano Avanzado', b1: 91, b2: 94, b3: null, b4: null },
  { nombre: 'Diego Flores',  curso: 'Piano Avanzado', b1: 55, b2: 62, b3: null, b4: null },
  { nombre: 'Flores Viza',   curso: 'Violín Clásico', b1: 82, b2: 85, b3: 87,  b4: null },
  { nombre: 'María López',   curso: 'Violín Clásico', b1: 78, b2: 80, b3: null, b4: null },
];

// ── Inscripciones ──────────────────────────────────────────────────────────
const INSCRIPS_SEED = [
  { estudiante: 'Flores Viza',  email: 'flores@estudiante.amc.bo', curso: 'Piano Forte',    nivel: 'Básico', fecha: '05/03/2024', pago: 'Pagado',    estado: 'Confirmado' },
  { estudiante: 'María López',  email: 'maria@estudiante.amc.bo',  curso: 'Violín Clásico', nivel: 'Medio',  fecha: '06/03/2024', pago: 'Pendiente', estado: 'En revisión' },
  { estudiante: 'Juan Pérez',   email: '',                          curso: 'Teoría Musical', nivel: 'Básico', fecha: '10/03/2024', pago: 'Pagado',    estado: 'Confirmado' },
];

// ── Pagos ──────────────────────────────────────────────────────────────────
const PAGOS_SEED = [
  { estudiante: 'Flores Viza', curso: 'Piano Forte',    monto: 350, moneda: 'Bs', fecha: '05/03/2026', metodo: 'Transferencia', estado: 'Pagado' },
  { estudiante: 'María López', curso: 'Violín Clásico', monto: 380, moneda: 'Bs', fecha: '08/03/2026', metodo: 'Efectivo',      estado: 'Pendiente' },
  { estudiante: 'Juan Pérez',  curso: 'Teoría Musical', monto: 280, moneda: 'Bs', fecha: '10/03/2026', metodo: 'QR',            estado: 'Pagado' },
];

// ── Contenido público ──────────────────────────────────────────────────────
const CONTENIDO_SEED = {
  general: {
    titulo:    'Conoce la Convocatoria 2026',
    subtitulo: 'Inscríbete en la Academia de Música Man Césped',
    cuerpo:    'Formamos músicos desde 1940. Ofrecemos cursos de piano, violín, guitarra, canto y teoría musical.',
    boton:     'Ver cronograma',
  },
  historia: {
    titulo:    'Historia de la Academia',
    subtitulo: 'Ochenta años formando músicos bolivianos',
    cuerpo:    'La Academia Man Césped fue fundada en 1940 con la misión de democratizar la educación musical. A lo largo de ocho décadas ha formado a miles de músicos que hoy integran orquestas nacionales e internacionales.',
    boton:     'Leer más',
  },
};

// ── Función principal ──────────────────────────────────────────────────────
export async function seedFirestore() {
  console.log('🌱 Iniciando seed de Firestore...');
  const batch = writeBatch(db);

  // 1. Usuarios en Auth + Firestore
  for (const u of USUARIOS_SEED) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, u.email, u.password);
      const uid  = cred.user.uid;
      batch.set(doc(db, 'usuarios', uid), {
        uid,
        nombre:    u.nombre,
        email:     u.email,
        rol:       u.rol,
        activo:    u.activo,
        creadoEn:  new Date().toISOString(),
      });
      console.log(`  ✅ Usuario creado: ${u.email}`);
    } catch (e) {
      console.warn(`  ⚠️  ${u.email}: ${e.message}`);
    }
  }

  // 2. Cursos
  for (const c of CURSOS_SEED) {
    batch.set(doc(db, 'cursos', c.id), { ...c, creadoEn: new Date().toISOString() });
  }

  // 3. Alumnos
  for (const a of ALUMNOS_SEED) {
    const ref = doc(collection(db, 'alumnos'));
    batch.set(ref, { ...a, creadoEn: new Date().toISOString() });
  }

  // 4. Calificaciones
  for (const c of CALIFS_SEED) {
    const ref = doc(collection(db, 'calificaciones'));
    batch.set(ref, { ...c, _ultimaEdicion: null, creadoEn: new Date().toISOString() });
  }

  // 5. Inscripciones
  for (const i of INSCRIPS_SEED) {
    const ref = doc(collection(db, 'inscripciones'));
    batch.set(ref, { ...i, creadoEn: new Date().toISOString() });
  }

  // 6. Pagos
  for (const p of PAGOS_SEED) {
    const ref = doc(collection(db, 'pagos'));
    batch.set(ref, { ...p, creadoEn: new Date().toISOString() });
  }

  // 7. Contenido público
  for (const [id, data] of Object.entries(CONTENIDO_SEED)) {
    batch.set(doc(db, 'contenido', id), { ...data, updatedAt: new Date().toISOString() });
  }

  await batch.commit();
  console.log('✅ Seed completado. Revisa Firestore Console.');
}
