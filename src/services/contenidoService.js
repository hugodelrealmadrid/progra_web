import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import { DEFAULT_GENERAL, DEFAULT_HISTORIA, DEFAULT_CURSOS } from '../data/contenidoDefaults';

const LOCAL_KEY = 'amc_contenido_publico';
const CONTENIDO_EVENT = 'amc-contenido-update';

export function notifyContenidoChange() {
  window.dispatchEvent(new Event(CONTENIDO_EVENT));
}

function onLocalChange(callback) {
  const handler = () => callback();
  window.addEventListener(CONTENIDO_EVENT, handler);
  return () => window.removeEventListener(CONTENIDO_EVENT, handler);
}

function loadLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return {
    general: DEFAULT_GENERAL,
    historia: DEFAULT_HISTORIA,
    cursos: DEFAULT_CURSOS,
  };
}

function saveLocal(data) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
}

function getLocal() {
  const data = loadLocal();
  return {
    general: { ...DEFAULT_GENERAL, ...data.general },
    historia: { ...DEFAULT_HISTORIA, ...data.historia },
    cursos: data.cursos?.length ? data.cursos : DEFAULT_CURSOS,
  };
}

// ——— General ———
export async function fetchGeneral() {
  if (!isFirebaseConfigured) return getLocal().general;

  const snap = await getDoc(doc(db, 'contenido', 'general'));
  if (snap.exists()) return { ...DEFAULT_GENERAL, ...snap.data() };
  await setDoc(doc(db, 'contenido', 'general'), DEFAULT_GENERAL);
  return DEFAULT_GENERAL;
}

export function subscribeGeneral(callback) {
  if (!isFirebaseConfigured) {
    const load = () => callback(getLocal().general);
    load();
    return onLocalChange(load);
  }

  return onSnapshot(doc(db, 'contenido', 'general'), (snap) => {
    callback(snap.exists() ? { ...DEFAULT_GENERAL, ...snap.data() } : DEFAULT_GENERAL);
  });
}

export async function saveGeneral(data) {
  const payload = { ...data, updatedAt: new Date().toISOString() };

  if (isFirebaseConfigured) {
    await setDoc(doc(db, 'contenido', 'general'), payload, { merge: true });
  } else {
    const local = loadLocal();
    local.general = payload;
    saveLocal(local);
    notifyContenidoChange();
  }
  return payload;
}

// ——— Historia ———
export async function fetchHistoria() {
  if (!isFirebaseConfigured) return getLocal().historia;

  const snap = await getDoc(doc(db, 'contenido', 'historia'));
  if (snap.exists()) return { ...DEFAULT_HISTORIA, ...snap.data() };
  await setDoc(doc(db, 'contenido', 'historia'), DEFAULT_HISTORIA);
  return DEFAULT_HISTORIA;
}

export function subscribeHistoria(callback) {
  if (!isFirebaseConfigured) {
    const load = () => callback(getLocal().historia);
    load();
    return onLocalChange(load);
  }

  return onSnapshot(doc(db, 'contenido', 'historia'), (snap) => {
    callback(snap.exists() ? { ...DEFAULT_HISTORIA, ...snap.data() } : DEFAULT_HISTORIA);
  });
}

export async function saveHistoria(data) {
  const payload = { ...data, updatedAt: new Date().toISOString() };

  if (isFirebaseConfigured) {
    await setDoc(doc(db, 'contenido', 'historia'), payload, { merge: true });
  } else {
    const local = loadLocal();
    local.historia = payload;
    saveLocal(local);
    notifyContenidoChange();
  }
  return payload;
}

// ——— Cursos destacados ———
export async function fetchCursosDestacados() {
  if (!isFirebaseConfigured) {
    return getLocal().cursos.filter((c) => c.estado === 'Activo');
  }

  const q = query(collection(db, 'cursos'), where('estado', '==', 'Activo'));
  const snap = await getDocs(q);
  if (snap.empty) {
    await Promise.all(
      DEFAULT_CURSOS.map((c) => setDoc(doc(db, 'cursos', c.id), c))
    );
    return DEFAULT_CURSOS;
  }
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export function subscribeCursos(callback) {
  if (!isFirebaseConfigured) {
    const load = () => callback(getLocal().cursos.filter((c) => c.estado === 'Activo'));
    load();
    return onLocalChange(load);
  }

  const q = query(collection(db, 'cursos'), where('estado', '==', 'Activo'));
  return onSnapshot(q, (snap) => {
    const cursos = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(cursos.length ? cursos : DEFAULT_CURSOS);
  });
}

export async function syncCurso(curso) {
  const id = curso.id || curso.codigo;
  const payload = { ...curso, id, destacado: curso.destacado ?? true };

  if (isFirebaseConfigured) {
    await setDoc(doc(db, 'cursos', id), payload, { merge: true });
  } else {
    const local = loadLocal();
    const idx = local.cursos.findIndex((c) => c.id === id);
    if (idx >= 0) local.cursos[idx] = payload;
    else local.cursos.push(payload);
    saveLocal(local);
    notifyContenidoChange();
  }
}

export async function removeCurso(id) {
  if (isFirebaseConfigured) {
    await deleteDoc(doc(db, 'cursos', id));
  } else {
    const local = loadLocal();
    local.cursos = local.cursos.filter((c) => c.id !== id);
    saveLocal(local);
    notifyContenidoChange();
  }
}

export function getFirebaseStatus() {
  return { configured: isFirebaseConfigured, mode: isFirebaseConfigured ? 'firestore' : 'local' };
}
