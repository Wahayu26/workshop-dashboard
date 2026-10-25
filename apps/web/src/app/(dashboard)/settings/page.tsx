'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Building2,
  Clock,
  Receipt,
  MessageSquare,
  Shield,
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Phone,
  Mail,
  MapPin,
  Percent,
  FileText,
  Smartphone,
  QrCode,
  Lock,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function SettingsPage() {
  const { user, role } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'hours' | 'tax' | 'notification' | 'roles'>('profile');
  const [isSaved, setIsSaved] = useState(false);

  // Form states
  const [formState, setFormState] = useState({
    workshopName: 'BengkelKu Motor & Mobil Center',
    address: 'Jl. Otomotif Raya No. 88, Gandaria, Jakarta Selatan, DKI Jakarta 12340',
    phone: '0812-9988-7766',
    email: 'support@bengkelku.id',
    weekdaysHours: '08:00 - 17:00 WIB',
    saturdayHours: '08:00 - 15:00 WIB',
    sundayHours: 'Tutup (Libur)',
    taxPercentage: 11,
    taxEnabled: true,
    invoiceFooter: 'Terima kasih telah mempercayakan perawatan kendaraan Anda kepada BengkelKu. Garansi servis resmi 14 hari atau 1.000 KM.',
    waGatewayEnabled: true,
    reminderIntervalDays: 90,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-7 h-7 text-racing-500" />
            Pengaturan Bengkel & Sistem
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Konfigurasi profil operasional bengkel, jam kerja, kebijakan pajak nota, dan gateway notifikasi
          </p>
        </div>

        {isSaved && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 px-3.5 py-1.5 rounded-xl text-xs font-semibold"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Pengaturan berhasil disimpan!</span>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Tabs */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'profile'
                ? 'bg-racing-500 text-white shadow-md shadow-racing-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Profil Bengkel</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('hours')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'hours'
                ? 'bg-racing-500 text-white shadow-md shadow-racing-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Jam Operasional</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tax')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'tax'
                ? 'bg-racing-500 text-white shadow-md shadow-racing-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Pajak & Format Struk</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notification')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'notification'
                ? 'bg-racing-500 text-white shadow-md shadow-racing-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Gateway WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('roles')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'roles'
                ? 'bg-racing-500 text-white shadow-md shadow-racing-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Matriks Hak Akses</span>
          </button>
        </div>

        {/* Tab Content Box */}
        <div className="md:col-span-3 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <form onSubmit={handleSave} className="space-y-6">
            {/* TAB: PROFILE */}
            {activeTab === 'profile' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Identitas & Legalitas Bengkel</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Data ini akan dicantumkan secara otomatis pada kop surat Work Order dan Struk Kasir POS.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Nama Resmi Bengkel
                    </label>
                    <input
                      type="text"
                      value={formState.workshopName}
                      onChange={(e) => setFormState({ ...formState, workshopName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-racing-500/20 focus:border-racing-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Alamat Lengkap Workshop
                    </label>
                    <textarea
                      rows={3}
                      value={formState.address}
                      onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-racing-500/20 focus:border-racing-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Nomor Telepon / WhatsApp CS
                      </label>
                      <input
                        type="text"
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-racing-500/20 focus:border-racing-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Email Resmi
                      </label>
                      <input
                        type="email"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-racing-500/20 focus:border-racing-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: HOURS */}
            {activeTab === 'hours' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Jadwal & Jam Buka Bengkel</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Menentukan ketersediaan slot antrian booking online bagi pelanggan.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Senin s/d Jumat (Hari Kerja)</p>
                      <p className="text-xs text-slate-500">Menerima servis reguler dan general repair</p>
                    </div>
                    <input
                      type="text"
                      value={formState.weekdaysHours}
                      onChange={(e) => setFormState({ ...formState, weekdaysHours: e.target.value })}
                      className="w-48 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Sabtu (Weekend)</p>
                      <p className="text-xs text-slate-500">Jam operasional setengah hari</p>
                    </div>
                    <input
                      type="text"
                      value={formState.saturdayHours}
                      onChange={(e) => setFormState({ ...formState, saturdayHours: e.target.value })}
                      className="w-48 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Minggu & Hari Libur Nasional</p>
                      <p className="text-xs text-slate-500">Hanya melayani booking terjadwal</p>
                    </div>
                    <input
                      type="text"
                      value={formState.sundayHours}
                      onChange={(e) => setFormState({ ...formState, sundayHours: e.target.value })}
                      className="w-48 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: TAX & RECEIPT */}
            {activeTab === 'tax' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Pajak (PPN) & Konfigurasi Struk Kasir</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Pengaturan perhitungan pajak pertambahan nilai pada POS dan teks footer garansi.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Aktifkan Pajak Pertambahan Nilai (PPN)</p>
                      <p className="text-xs text-slate-500">Dihitung otomatis saat checkout kasir</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formState.taxEnabled}
                      onChange={(e) => setFormState({ ...formState, taxEnabled: e.target.checked })}
                      className="w-5 h-5 accent-racing-500 rounded cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Tarif PPN (%)
                    </label>
                    <input
                      type="number"
                      value={formState.taxPercentage}
                      onChange={(e) => setFormState({ ...formState, taxPercentage: Number(e.target.value) })}
                      className="w-32 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Teks Footer & Kebijakan Garansi Struk 80mm
                    </label>
                    <textarea
                      rows={3}
                      value={formState.invoiceFooter}
                      onChange={(e) => setFormState({ ...formState, invoiceFooter: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-racing-500/20 focus:border-racing-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: NOTIFICATION */}
            {activeTab === 'notification' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Integrasi WhatsApp Gateway & Reminder</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Kirim notifikasi otomatis saat WO selesai dan pengingat servis berkala (periodical maintenance).
                  </p>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Status WhatsApp API Gateway</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">● Terhubung (Device: BengkelKu Server 01)</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-white dark:bg-slate-900 border rounded-lg text-slate-700 dark:text-slate-300">
                    Online
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Kirim WhatsApp Saat SPK Selesai QC</p>
                      <p className="text-xs text-slate-500">Pelanggan menerima notifikasi bahwa kendaraan siap diambil</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 accent-racing-500 rounded cursor-pointer"
                    />
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Auto Reminder Servis Berkala</p>
                      <p className="text-xs text-slate-500">Pemberitahuan ramah untuk ganti oli / cek rutin berikutnya</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Interval:</span>
                      <select className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
                        <option>Setiap 90 Hari (3 Bulan)</option>
                        <option>Setiap 60 Hari (2 Bulan)</option>
                        <option>Setiap 180 Hari (6 Bulan)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ROLES MATRIX */}
            {activeTab === 'roles' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Matriks Hak Akses Pengguna (RBAC)</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Gambaran wewenang operasional untuk setiap peran dalam ekosistem BengkelKu.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Modul / Menu</th>
                        <th className="py-2.5 px-3 text-center">OWNER</th>
                        <th className="py-2.5 px-3 text-center">ADMIN / SA</th>
                        <th className="py-2.5 px-3 text-center">CASHIER</th>
                        <th className="py-2.5 px-3 text-center">MECHANIC</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">Dashboard & Ringkasan</td>
                        <td className="py-2.5 px-3 text-center text-emerald-500">✓ Full</td>
                        <td className="py-2.5 px-3 text-center text-emerald-500">✓ Full</td>
                        <td className="py-2.5 px-3 text-center text-emerald-500">✓ Full</td>
                        <td className="py-2.5 px-3 text-center text-slate-400">-</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">Work Order & Kanban</td>
                        <td className="py-2.5 px-3 text-center text-emerald-500">✓ Full</td>
                        <td className="py-2.5 px-3 text-center text-emerald-500">✓ Full</td>
                        <td className="py-2.5 px-3 text-center text-amber-500">Lihat</td>
                        <td className="py-2.5 px-3 text-center text-emerald-500">✓ Update Status</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">Kasir & Pembayaran POS</td>
                        <td className="py-2.5 px-3 text-center text-emerald-500">✓ Full</td>
                        <td className="py-2.5 px-3 text-center text-emerald-500">✓ Full</td>
                        <td className="py-2.5 px-3 text-center text-emerald-500">✓ Full</td>
                        <td className="py-2.5 px-3 text-center text-slate-400">-</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">Inventori & Harga Modal</td>
                        <td className="py-2.5 px-3 text-center text-emerald-500">✓ Full</td>
                        <td className="py-2.5 px-3 text-center text-emerald-500">✓ Full</td>
                        <td className="py-2.5 px-3 text-center text-amber-500">Harga Jual Saja</td>
                        <td className="py-2.5 px-3 text-center text-slate-400">-</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">Laporan Laba / Rugi</td>
                        <td className="py-2.5 px-3 text-center text-emerald-500">✓ Full</td>
                        <td className="py-2.5 px-3 text-center text-slate-400">-</td>
                        <td className="py-2.5 px-3 text-center text-slate-400">-</td>
                        <td className="py-2.5 px-3 text-center text-slate-400">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-racing-500 hover:bg-racing-600 text-white transition-all shadow-md shadow-racing-500/20 active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Seluruh Pengaturan</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
