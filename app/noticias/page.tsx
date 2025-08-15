import Link from 'next/link'

const noticias = [
  {
    id: 1,
    title: 'ANAMOLA Realiza Encontro Nacional de Lideranças',
    excerpt: 'Líderes do partido de todas as províncias se reuniram para discutir estratégias de desenvolvimento e crescimento.',
    date: '15 de Agosto, 2024',
    category: 'Eventos',
    image: '/api/placeholder/400/250'
  },
  {
    id: 2,
    title: 'Nova Iniciativa de Desenvolvimento Comunitário',
    excerpt: 'Lançamos um programa para apoiar projetos de desenvolvimento nas comunidades rurais de Moçambique.',
    date: '10 de Agosto, 2024',
    category: 'Projetos',
    image: '/api/placeholder/400/250'
  },
  {
    id: 3,
    title: 'Declaração sobre Políticas Educacionais',
    excerpt: 'O ANAMOLA apresenta suas propostas para melhorar o sistema educacional moçambicano.',
    date: '5 de Agosto, 2024',
    category: 'Políticas',
    image: '/api/placeholder/400/250'
  },
  {
    id: 4,
    title: 'Visita às Comunidades Rurais de Gaza',
    excerpt: 'Nossa equipe visitou comunidades rurais para ouvir as necessidades locais e apresentar nossas propostas.',
    date: '1 de Agosto, 2024',
    category: 'Eventos',
    image: '/api/placeholder/400/250'
  },
  {
    id: 5,
    title: 'Parceria com Organizações Internacionais',
    excerpt: 'ANAMOLA estabelece parcerias estratégicas para promover o desenvolvimento sustentável.',
    date: '28 de Julho, 2024',
    category: 'Cooperação',
    image: '/api/placeholder/400/250'
  },
  {
    id: 6,
    title: 'Programa de Capacitação para Jovens',
    excerpt: 'Iniciamos um programa de capacitação profissional para jovens em situação de vulnerabilidade.',
    date: '25 de Julho, 2024',
    category: 'Projetos',
    image: '/api/placeholder/400/250'
  }
]

export default function NoticiasPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Notícias e Atualizações
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Fique por dentro das últimas atividades, eventos e iniciativas do partido ANAMOLA.
          </p>
        </div>
      </div>

      {/* Filtros */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              Todas
            </button>
            <button className="bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100">
              Eventos
            </button>
            <button className="bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100">
              Projetos
            </button>
            <button className="bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100">
              Políticas
            </button>
            <button className="bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100">
              Cooperação
            </button>
          </div>
        </div>
      </section>

      {/* Lista de Notícias */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {noticias.map((noticia) => (
              <article
                key={noticia.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-2xl">📰</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {noticia.category}
                    </span>
                    <span className="text-gray-500 text-sm ml-auto">
                      {noticia.date}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                    {noticia.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {noticia.excerpt}
                  </p>
                  <Link
                    href={`/noticias/${noticia.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Ler mais →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Paginação */}
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button className="px-3 py-2 text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Anterior
              </button>
              <button className="px-3 py-2 text-white bg-blue-600 border border-blue-600 rounded-md">
                1
              </button>
              <button className="px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                3
              </button>
              <button className="px-3 py-2 text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Próximo
              </button>
            </nav>
          </div>
        </div>
      </section>
    </div>
  )
}