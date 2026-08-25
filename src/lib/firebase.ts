import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  browserLocalPersistence,
  setPersistence,
} from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Valores de placeholder para um projeto Firebase "demo-*" (reconhecido pelo SDK
// como um projeto local/offline). Garantem que o app sempre inicializa — mesmo
// sem nenhuma variável de ambiente configurada — em vez de quebrar o build.
// Assim que houver um projeto Firebase real, essas envs devem ser preenchidas.
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-sitecasamento.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-sitecasamento",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-sitecasamento.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:000000000000:web:0000000000000000000000",
};

const useEmulators = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true";

// Verdadeiro assim que houver um projeto Firebase real de verdade por trás (seja
// um projeto real em produção, seja os emuladores locais rodando em dev). Falso
// só quando ainda estamos com os valores de placeholder "demo-*" sem emuladores
// — nesse caso não faz sentido nem tentar falar com o Firestore de verdade.
export const usingRealBackend = firebaseConfig.projectId !== "demo-sitecasamento" || useEmulators;

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

if (typeof window !== "undefined") {
  setPersistence(auth, browserLocalPersistence).catch(() => {
    /* ignore: falls back to in-memory persistence */
  });
}

// Conecta nos emuladores locais uma única vez (evita reconectar em hot-reload).
declare global {
  var __firebaseEmulatorsConnected: boolean | undefined;
}

if (useEmulators && typeof window !== "undefined" && !globalThis.__firebaseEmulatorsConnected) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  connectStorageEmulator(storage, "127.0.0.1", 9199);
  globalThis.__firebaseEmulatorsConnected = true;
}
