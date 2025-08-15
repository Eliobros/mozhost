import React from 'react'
import Link from 'next/link'

const news = [
  {
    id: 1,
    title: 'ANAMOLA Realiza Encontro Nacional de Lideranças',
    excerpt: 'Líderes do partido de todas as províncias se reuniram para discutir estratégias de desenvolvimento e crescimento.',
    date: '15 de Agosto, 2024',
    category: 'Eventos',
    image: '/api/placeholder/300/200'
  },
  {
    id: 2,
    title: 'Nova Iniciativa de Desenvolvimento Comunitário',
    excerpt: 'Lançamos um programa para apoiar projetos de desenvolvimento nas comunidades rurais de Moçambique.',
    date: '10 de Agosto, 2024',
    category: 'Projetos',
    image: '/api/placeholder/300/200'
  },
  {
    id: 3,
    title: 'Declaração sobre Políticas Educacionais',
    excerpt: 'O ANAMOLA apresenta suas propostas para melhorar o sistema educacional moçambicano.',
    date: '5 de Agosto, 2024',
    category: 'Políticas',
    image: '/api/placeholder/300/200'
  }
]

export default function NewsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Últimas Notícias
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Fique por dentro das últimas atividades, eventos e iniciativas do partido ANAMOLA.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {news.map((item) => (
            <article
              key={item.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">📰</span>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {item.category}
                  </span>
                  <span className="text-gray-500 text-sm ml-auto">
                    {item.date}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {item.excerpt}
                </p>
                <Link
                  href={`/noticias/${item.id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Ler mais →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/noticias"
            className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-200"
          >
            Ver Todas as Notícias
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}