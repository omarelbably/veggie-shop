/**
 * Root Layout
 * 
 * Main application layout with providers and global structure.
 * 
 * @layout RootLayout
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider, CartProvider } from '@/contexts';
import { Navbar, Footer } from '@/components';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VeggieShop - Fresh Vegetables Online',
  description: 'Your one-stop shop for fresh, quality vegetables delivered straight to your doorstep.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
