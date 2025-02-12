/* eslint-disable no-console */
import { useRouter } from 'next/router';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

// Define a type for our session data.
type SessionData = {
  value: boolean;
  expiry: number;
};

// Session duration (for example, 1 hour)
const SESSION_DURATION = 3600000; // 1 hour = 3600000 ms

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ isAuthenticated, setIsAuthenticated ] = useState(false);
  const [ isInitialized, setIsInitialized ] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const sessionDataStr = localStorage.getItem('session_active');
    if (sessionDataStr) {
      try {
        const sessionData = JSON.parse(sessionDataStr) as SessionData;
        // Check expiry
        if (sessionData.expiry && new Date().getTime() < sessionData.expiry) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('session_active');
        }
      } catch (e) {
        console.error('Error parsing session data', e);
        localStorage.removeItem('session_active');
      }
    }
    setIsInitialized(true);
  }, []);

  const login = useCallback(() => {
    console.log('AuthContext: login() called');
    const expiry = new Date().getTime() + SESSION_DURATION;
    const sessionData: SessionData = { value: true, expiry };
    localStorage.setItem('session_active', JSON.stringify(sessionData));

    // Force a re-render by resetting state
    setIsAuthenticated(false);
    setTimeout(() => setIsAuthenticated(true), 0);

    console.log('AuthContext: isAuthenticated set to true');
    router.push('/');
    console.log('AuthContext: Redirecting to home');
  }, [ router ]);

  const logout = useCallback(() => {
    localStorage.removeItem('session_active');
    setIsAuthenticated(false);
    router.push('/');
  }, [ router ]);

  // Until we've finished checking the session data, don't render anything (or show a loader)
  if (!isInitialized) {
    return null; // Or a loading spinner, e.g.: <div>Loading...</div>
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      { children }
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
