import './globals.css';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'UUP Software Workspace',
  description: 'Explorando o Futuro da Engenharia de Software',
};

// Aqui está a mágica do Mobile! Impede reduzir a tela, mas permite o zoom in.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1, 
  maximumScale: 5, 
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}