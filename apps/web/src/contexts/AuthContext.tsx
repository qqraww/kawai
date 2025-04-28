"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User, LoginRequest, RegisterRequest } from '@/../../packages/shared/src/types/auth';

interface AuthContextType extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateAvatar: (avatar: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const LOCAL_KEY = 'kawai-auth';

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  });

  // Автовосстановление сессии
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_KEY) : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.token && parsed.user) {
          setState(prev => ({
            ...prev,
            user: parsed.user,
            token: parsed.token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          }));
        }
      } catch {}
    }
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      const { user, token } = await response.json();
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_KEY, JSON.stringify({ user, token }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed'
      }));
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      const { user, token } = await response.json();
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_KEY, JSON.stringify({ user, token }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Registration failed'
      }));
    }
  };

  const logout = () => {
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_KEY);
    }
  };

  const updateAvatar = async (avatar: string) => {
    if (!state.user) return;
    try {
      const res = await fetch(`/api/users/${state.user.id}/avatar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorId: state.user.id, avatar })
      });
      if (!res.ok) throw new Error('Failed to update avatar');
      const updated = await res.json();
      setState(prev => ({
        ...prev,
        user: { ...prev.user!, avatar: updated.avatar }
      }));
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_KEY, JSON.stringify({ user: { ...state.user, avatar }, token: state.token }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  );
}; 