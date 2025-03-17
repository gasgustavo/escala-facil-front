import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Bem-vindo ao Escala Fácil
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Sistema de gestão de escalas de trabalho para sua empresa
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Link
            href="/empresas"
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-4">Empresas</h2>
            <p className="text-gray-600">
              Gerencie suas empresas e configure as escalas de trabalho
            </p>
          </Link>

          <Link
            href="/funcionarios"
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-4">Funcionários</h2>
            <p className="text-gray-600">
              Cadastre e gerencie os funcionários de cada empresa
            </p>
          </Link>

          <Link
            href="/resumo"
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-4">Resumo</h2>
            <p className="text-gray-600">
              Visualize o resumo de pagamentos e escalas
            </p>
          </Link>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-4">Como começar?</h2>
          <ol className="max-w-2xl mx-auto text-left space-y-4">
            <li className="flex items-start">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold mr-4">
                1
              </span>
              <p>
                Comece cadastrando sua empresa na seção{' '}
                <Link href="/empresas" className="text-blue-500 hover:underline">
                  Empresas
                </Link>
              </p>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold mr-4">
                2
              </span>
              <p>
                Adicione seus funcionários na seção{' '}
                <Link href="/funcionarios" className="text-blue-500 hover:underline">
                  Funcionários
                </Link>
              </p>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold mr-4">
                3
              </span>
              <p>
                Configure as escalas de trabalho e visualize o resumo na seção{' '}
                <Link href="/resumo" className="text-blue-500 hover:underline">
                  Resumo
                </Link>
              </p>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
} 