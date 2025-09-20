'use client';

import { createContext, useContext, useState, useEffect, type ReactElement } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange, signIn, signUp, signOut, signInWithGoogle } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<User>;
}

// Create the auth context with a default value
const AuthContext = createContext({
  user: null,
  loading: true,
  signIn,
  signUp,
  signOut,
  signInWithGoogle,
} as AuthContextType);

type AuthProviderProps = {
  children: React.ReactNode;
};

// Define the component as a function declaration
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
