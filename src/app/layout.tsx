import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AuthInitializer } from '@/components/auth/AuthInitializer';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Whudey - Admin Dashboard',
  description: 'Administrative dashboard for Whudey platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <AuthInitializer> 
              {children}
              <Toaster />
            </AuthInitializer>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
