'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Shield, Car, Bike, Lock, Mail, ArrowRight, CheckCircle2, UserCheck } from 'lucide-react';
import { useAuth, DEMO_ACCOUNTS, Role } from '@/lib/auth-context';

export default function LoginPage() {
  const { login, quickLoginAsRole, isLoading } = useAuth();
  const [email, setEmail] = useState('owner@bengkelku.id');
  const [password, setPassword] = useState('bengkel123');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'form' | 'demo'>('form');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await login(email, password);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login gagal. Periksa kembali email dan password Anda.');
    }
  };

  const handleQuickLogin = async (role: Role) => {
    setErrorMsg('');
    try {
      await quickLoginAsRole(role);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal login role.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-racing-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-steel-blue/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-racing-500 to-racing-600 shadow-glow mb-4 text-white">
            <Wrench className="w-8 h-8 animate-pulse" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
            Bengkel<span className="text-racing-500">Ku</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Sistem Manajemen Bengkel Servis Mobil & Motor Terpadu
          </p>

          {/* Automotive Tag Badges */}
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
              <Car className="w-3.5 h-3.5 text-racing-400" /> Servis Mobil
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
              <Bike className="w-3.5 h-3.5 text-yellow-400" /> Servis Motor
            </span>
          </div>
        </div>

        {/* Card Box */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/* Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950/60 rounded-xl mb-6 border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'form'
                  ? 'bg-racing-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Login Kredensial
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('demo')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'demo'
                  ? 'bg-racing-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" /> Quick Role Test
            </button>
          </div>

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2"
            >
              <Shield className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {activeTab === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5" htmlFor="email-input">
                  Alamat Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@bengkelku.id"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-racing-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5" htmlFor="password-input">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="password-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-racing-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-slate-700 bg-slate-800 text-racing-500 focus:ring-racing-500"
                  />
                  <span>Ingat saya</span>
                </label>
                <span className="text-racing-400 hover:underline cursor-pointer">Lupa password?</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-racing-500 to-racing-600 hover:from-racing-600 hover:to-racing-700 text-white font-semibold text-sm shadow-glow flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Masuk ke Sistem</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-slate-400 mb-3">
                Klik salah satu role di bawah untuk langsung simulasi hak akses RBAC:
              </p>
              {(Object.keys(DEMO_ACCOUNTS) as Role[]).map((r) => {
                const item = DEMO_ACCOUNTS[r];
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleQuickLogin(r)}
                    className="w-full p-3 text-left rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-racing-500/50 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-racing-400 transition-colors">
                        {item.label}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {item.name} • <span className="font-mono text-slate-500">{item.email}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 group-hover:bg-racing-500/20 group-hover:text-racing-400">
                      {r}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Info Box */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Keamanan JWT + Argon2/Bcrypt
            </span>
            <span className="font-mono">v1.0.0 Ready</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
