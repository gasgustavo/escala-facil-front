'use client';

import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '@/config/authConfig';
import Link from 'next/link';

// Initialize MSAL outside of component
const msalInstance = new PublicClientApplication(msalConfig);
msalInstance.initialize().catch(console.error);

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MsalProvider instance={msalInstance}>
      <header className="bg-blue-600 text-white p-4">
        <nav className="container mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Escala Fácil
          </Link>
          <div className="space-x-4">
            <Link href="/empresas" className="hover:text-blue-200">
              Empresas
            </Link>
            <Link href="/funcionarios" className="hover:text-blue-200">
              Funcionários
            </Link>
          </div>
        </nav>
      </header>
      {children}
    </MsalProvider>
  );
} 