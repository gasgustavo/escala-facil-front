import './globals.css';
import { Inter } from 'next/font/google';
import ClientLayout from '@/components/ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Escala Fácil',
  description: 'Sistema de gerenciamento de escalas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ClientLayout>
          <nav className="bg-gray-800 text-white">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <a href="/" className="text-xl font-bold">
                    Escala Fácil
                  </a>
                </div>
                <div className="flex space-x-4">
                  <a href="/empresas" className="hover:text-gray-300">
                    Empresas
                  </a>
                  <a href="/funcionarios" className="hover:text-gray-300">
                    Funcionários
                  </a>
                </div>
              </div>
            </div>
          </nav>
          <main className="min-h-screen bg-gray-50">{children}</main>
        </ClientLayout>
      </body>
    </html>
  );
} 