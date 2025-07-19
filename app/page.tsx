'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 to-white dark:from-gray-950 dark:to-gray-900 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center">
        <Image
          src="/mozhost.png"
          alt="MozHost Logo"
          width={120}
          height={120}
          className="mx-auto mb-6 drop-shadow-lg"
        />
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
          Bem-vindo ao <span className="text-blue-600">MozHost</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-6">
          Hospede bots, APIs e automações com desempenho, segurança e escalabilidade — tudo em um só lugar.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-gray-900 font-semibold border border-gray-300 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 transition"
          >
            Criar conta
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          Comece agora a criar bots inteligentes e APIs modernas com a MozHost 🚀
        </p>
      </div>
    </main>
  );
}
