import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'ShelterLink - Real Estate & Artisan Marketplace',
  description: 'Connect with property owners, tenants, and verified artisans. Find homes, services, and opportunities.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
