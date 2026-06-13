import { initializeApp } from 'firebase/app';
import { getFirestore }   from 'firebase/firestore';
import { getAuth }        from 'firebase/auth';
import { getStorage }     from 'firebase/storage';

// ─── Tus credenciales reales de Firebase Console ───────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyDeimIXoEo_Uh5StkV0CF3jzzpDQKJSjwA",
  authDomain:        "proyectowebll.firebaseapp.com",
  projectId:         "proyectowebll",
  storageBucket:     "proyectowebll.firebasestorage.app",
  messagingSenderId: "550087202485",
  appId:             "1:550087202485:web:7e7b4a6756b36c5acf50fc",
  measurementId:     "G-ZBB5HKGSJS",
};
// ────────────────────────────────────────────────────────────────────────────

const app     = initializeApp(firebaseConfig);
export const db      = getFirestore(app);   // Firestore (tiempo real)
export const auth    = getAuth(app);        // Authentication
export const storage = getStorage(app);     // Storage (archivos/avatares)
export const isFirebaseConfigured = true;