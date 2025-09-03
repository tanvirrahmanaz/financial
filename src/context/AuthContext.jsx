import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from '../firebase/firebase.config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setCurrentUser);
    return unsubscribe;
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const googleLogin = () => signInWithPopup(auth, googleProvider);
  const register = (email, password) => createUserWithEmailAndPassword(auth, email, password);

  return (
    <AuthContext.Provider value={{ currentUser, login, googleLogin, register }}>
      {children}
    </AuthContext.Provider>
  );
};
// 