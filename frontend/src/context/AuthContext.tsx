"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface AuthState {
  token: string | null;
  email: string | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (token: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ token: null, email: null, loading: true });

  useEffect(() => {
    const token = localStorage.getItem("pl_token");
    const email = localStorage.getItem("pl_email");
    setState({ token, email, loading: false });
  }, []);

  function login(token: string, email: string) {
    localStorage.setItem("pl_token", token);
    localStorage.setItem("pl_email", email);
    setState({ token, email, loading: false });
  }

  function logout() {
    localStorage.removeItem("pl_token");
    localStorage.removeItem("pl_email");
    setState({ token: null, email: null, loading: false });
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
