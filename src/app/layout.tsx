import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Escala Fácil - Gestão de Escalas de Trabalho',
  description: 'Sistema de gestão de escalas de trabalho para empresas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <nav className="bg-gray-800 text-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-xl font-bold">
                  Escala Fácil
                </Link>
              </div>
              <div className="flex space-x-4">
                <Link
                  href="/empresas"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md"
                >
                  Empresas
                </Link>
                <Link
                  href="/funcionarios"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md"
                >
                  Funcionários
                </Link>
                <Link
                  href="/resumo"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md"
                >
                  Resumo
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen bg-gray-50">{children}</main>
      </body>
    </html>
  );
} 