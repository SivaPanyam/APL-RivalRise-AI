import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, googleProvider } from '../config/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  signOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

import LoadingScreen from '../components/LoadingScreen';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize a new user in Firestore
  async function initializeUserInDB(user, additionalData = {}) {
    const userDocRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDocRef);
    
    if (!docSnap.exists()) {
      const initialData = {
        uid: user.uid,
        email: user.email,
        username: additionalData.username || user.displayName || user.email.split('@')[0],
        role: 'player', // Role-ready structure ('player', 'admin', 'coach')
        streak: 1,
        level: 1,
        xp: 0,
        sportPreference: 'General',
        createdAt: serverTimestamp(),
        lastLogin: new Date().toISOString()
      };
      await setDoc(userDocRef, initialData);
      setUserData(initialData);
    } else {
      const existingData = docSnap.data();
      // Dynamically load StreakService to avoid circular dependency issues at boot
      const StreakService = (await import('../services/streakService')).default;
      await StreakService.evaluateDailyLogin(user.uid, existingData);
      
      // Fetch updated data after streak evaluation
      const updatedSnap = await getDoc(userDocRef);
      setUserData(updatedSnap.data());
    }
  }

  async function signup(email, password, username) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await initializeUserInDB(userCredential.user, { username });
    return userCredential;
  }

  async function login(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await initializeUserInDB(userCredential.user);
    return userCredential;
  }

  async function loginWithGoogle() {
    const userCredential = await signInWithPopup(auth, googleProvider);
    await initializeUserInDB(userCredential.user);
    return userCredential;
  }

  function logout() {
    setUserData(null);
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setCurrentUser(user);
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    signup,
    login,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
}
