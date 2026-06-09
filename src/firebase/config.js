import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDeimIXoEo_Uh5StkV0CF3jzzpDQKJSjwA",
  authDomain: "proyectowebll.firebaseapp.com",
  projectId: "proyectowebll",
  storageBucket: "proyectowebll.firebasestorage.app",
  messagingSenderId: "550087202485",
  appId: "1:550087202485:web:7e7b4a6756b36c5acf50fc",
  measurementId: "G-ZBB5HKGSJS"
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
);

let db = null;
let auth = null;

if (isFirebaseConfigured) {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
}

export { db, auth };