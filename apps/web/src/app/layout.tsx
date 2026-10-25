import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/lib/auth-context';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'BengkelKu - Sistem Manajemen Servis Mobil & Motor',
  description:
    'Aplikasi operasional bengkel modern terintegrasi untuk servis mobil dan motor. Kelola booking, work order kanban, inventori sparepart, kasir & invoice dengan mudah.',
  keywords: 'manajemen bengkel, servis mobil, servis motor, booking servis, POS bengkel, invoice bengkel, bengkelku',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
