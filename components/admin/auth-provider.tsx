"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

type AdminAuthContextValue = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

function adminAllowlist() {
  return (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    return onAuthStateChanged(auth, (next) => {
      setUser(next);
      setLoading(false);
    });
  }, []);

  const isAdmin = useMemo(() => {
    const email = user?.email?.toLowerCase();
    if (!email) return false;
    return adminAllowlist().includes(email);
  }, [user]);

  async function login(email: string, password: string) {
    if (!auth) throw new Error("Firebase auth is not configured");
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function logout() {
    if (!auth) return;
    await signOut(auth);
  }

  async function getToken() {
    if (!auth?.currentUser) return null;
    return auth.currentUser.getIdToken();
  }

  return (
    <AdminAuthContext.Provider value={{ user, loading, isAdmin, login, logout, getToken }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return context;
}
