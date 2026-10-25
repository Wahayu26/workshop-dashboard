'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from './api';

export type Role = 'OWNER' | 'ADMIN' | 'CASHIER' | 'MECHANIC' | 'CUSTOMER';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: Role;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  quickLoginAsRole: (role: Role) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Quick preset accounts for testing RBAC
export const DEMO_ACCOUNTS: Record<Role, { email: string; label: string; name: string }> = {
  OWNER: { email: 'owner@bengkelku.id', label: 'Owner (Pemilik Bengkel)', name: 'Bambang Sutrisno' },
  ADMIN: { email: 'admin@bengkelku.id', label: 'Admin Bengkel', name: 'Rian Pratama' },
  CASHIER: { email: 'kasir@bengkelku.id', label: 'Kasir', name: 'Siti Rahmawati' },
  MECHANIC: { email: 'mekanik1@bengkelku.id', label: 'Mekanik Kepala', name: 'Agus Santoso' },
  CUSTOMER: { email: 'budi@gmail.com', label: 'Pelanggan (Portal)', name: 'Budi Darmawan' },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('bengkelku_user');
      const token = localStorage.getItem('bengkelku_token');
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      } else {
        // Fallback default demo user to make testing effortless
        const defaultOwner: User = {
          id: 'demo-owner-id',
          email: 'owner@bengkelku.id',
          fullName: 'Bambang Sutrisno',
          role: 'OWNER',
        };
        setUser(defaultOwner);
        localStorage.setItem('bengkelku_user', JSON.stringify(defaultOwner));
        localStorage.setItem('bengkelku_token', 'demo-token');
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      try {
        const res: any = await api.post('/auth/login', { email, password: pass });
        const { user: userData, accessToken } = res.data || res;
        setUser(userData);
        localStorage.setItem('bengkelku_user', JSON.stringify(userData));
        localStorage.setItem('bengkelku_token', accessToken);
        router.push('/dashboard');
        return;
      } catch (err) {
        // If API is not running yet during offline preview, check demo accounts
        const matchedRole = Object.keys(DEMO_ACCOUNTS).find(
          (k) => DEMO_ACCOUNTS[k as Role].email === email,
        ) as Role | undefined;

        if (matchedRole) {
          const fallbackUser: User = {
            id: `demo-${matchedRole.toLowerCase()}`,
            email,
            fullName: DEMO_ACCOUNTS[matchedRole].name,
            role: matchedRole,
          };
          setUser(fallbackUser);
          localStorage.setItem('bengkelku_user', JSON.stringify(fallbackUser));
          localStorage.setItem('bengkelku_token', 'demo-token');
          router.push('/dashboard');
          return;
        }
        throw err;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const quickLoginAsRole = async (targetRole: Role) => {
    const acc = DEMO_ACCOUNTS[targetRole];
    await login(acc.email, 'bengkel123');
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    }
    setUser(null);
    localStorage.removeItem('bengkelku_user');
    localStorage.removeItem('bengkelku_token');
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        login,
        quickLoginAsRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
