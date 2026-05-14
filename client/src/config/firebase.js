import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAdKV21ZvrXfAQYuJD6YxFuOwOrqtF6xck",
  authDomain: "fanverse-ai-c706e.firebaseapp.com",
  projectId: "fanverse-ai-c706e",
  storageBucket: "fanverse-ai-c706e.firebasestorage.app",
  messagingSenderId: "223349418431",
  appId: "1:223349418431:web:123aa24631acd6e067d90a",
  measurementId: "G-E9PXPZJ98W"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
