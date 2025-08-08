// apps/web/src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; 
import './globals.css';
import Providers from './providers';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Paggo OCR',
  description: 'Extraia texto de documentos e interaja com IA.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      {}
      {}
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}