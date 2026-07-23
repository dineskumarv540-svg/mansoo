// Auth Context Provider managing persistent login state & auth methods
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import {
  loginWithEmail,
  signUpWithEmail,
  sendResetPasswordEmail,
  resendVerificationEmail,
  logoutUser,
  deleteUserAccount
} from '../services/authService';

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isEmailVerified: false,
  loading: true,
  login: async () => {},
  signUp: async () => {},
  sendResetEmail: async () => {},
  resendVerification: async () => {},
  logout: async () => {},
  deleteAccount: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Persistent auth state listener
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || 'Writer',
          emailVerified: firebaseUser.emailVerified,
          photoURL: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const res = await loginWithEmail(email, password);
    return res;
  };

  const signUp = async (email, password, displayName) => {
    const res = await signUpWithEmail(email, password, displayName);
    return res;
  };

  const sendResetEmail = async (email) => {
    return await sendResetPasswordEmail(email);
  };

  const resendVerification = async () => {
    return await resendVerificationEmail();
  };

  const logout = async () => {
    return await logoutUser();
  };

  const deleteAccount = async () => {
    return await deleteUserAccount();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isEmailVerified: user ? user.emailVerified : false,
        loading,
        login,
        signUp,
        sendResetEmail,
        resendVerification,
        logout,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
