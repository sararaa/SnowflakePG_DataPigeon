import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { BreadcrumbNav } from '@/components/layout/breadcrumb-nav';
import { CommandPalette } from '@/components/command-palette';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pigeon - Predictive Maintenance Dashboard',
  description: 'Real-time EV charger monitoring and predictive maintenance platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden ml-[80px] lg:ml-[240px] transition-all duration-300">
              <Header />
              <BreadcrumbNav />
              <main className="flex-1 overflow-y-auto bg-background">
                {children}
              </main>
            </div>
          </div>
          <CommandPalette />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
