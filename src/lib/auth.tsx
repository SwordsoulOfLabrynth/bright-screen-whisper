import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { api, readSession, writeSession, type AuthResponse, type Role } from "@/lib/api";

type AuthContextValue = {
  user: AuthResponse | null;
  ready: boolean;
  login: (input: { email: string; password: string }) => Promise<AuthResponse>;
  register: (input: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: Role;
  }) => Promise<AuthResponse>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(readSession());
    setReady(true);
  }, []);

  const login = useCallback(async (input: { email: string; password: string }) => {
    const session = await api.login(input);
    writeSession(session);
    setUser(session);
    return session;
  }, []);

  const register = useCallback<AuthContextValue["register"]>(async (input) => {
    const session = await api.register(input);
    writeSession(session);
    setUser(session);
    return session;
  }, []);

  const logout = useCallback(() => {
    writeSession(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, ready, login, register, logout }),
    [user, ready, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
