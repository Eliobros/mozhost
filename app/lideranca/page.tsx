const lideres = [
  {
    nome: 'Dr. João Silva',
    cargo: 'Presidente Nacional',
    foto: '/api/placeholder/300/300',
    bio: 'Líder visionário com mais de 20 anos de experiência em política e desenvolvimento social.',
    provincias: ['Nacional']
  },
  {
    nome: 'Dra. Maria Santos',
    cargo: 'Vice-Presidente',
    foto: '/api/placeholder/300/300',
    bio: 'Especialista em políticas públicas e desenvolvimento económico sustentável.',
    provincias: ['Nacional']
  },
  {
    nome: 'Eng. Carlos Ferreira',
    cargo: 'Secretário-Geral',
    foto: '/api/placeholder/300/300',
    bio: 'Engenheiro com vasta experiência em infraestruturas e desenvolvimento regional.',
    provincias: ['Nacional']
  },
  {
    nome: 'Prof. Ana Costa',
    cargo: 'Coordenadora de Educação',
    foto: '/api/placeholder/300/300',
    bio: 'Professora universitária dedicada à melhoria do sistema educacional moçambicano.',
    provincias: ['Maputo', 'Gaza']
  },
  {
    nome: 'Dr. Pedro Mendes',
    cargo: 'Coordenador de Saúde',
    foto: '/api/placeholder/300/300',
    bio: 'Médico especialista em saúde pública com foco em comunidades rurais.',
    provincias: ['Sofala', 'Manica']
  },
  {
    nome: 'Sra. Isabel Rocha',
    cargo: 'Coordenadora de Juventude',
    foto: '/api/placeholder/300/300',
    bio: 'Ativista social comprometida com o empoderamento da juventude moçambicana.',
    provincias: ['Nampula', 'Cabo Delgado']
  }
]

export default function LiderancaPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Nossa Liderança
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Conheça os líderes comprometidos com o desenvolvimento de Moçambique 
            e com a missão do partido ANAMOLA.
          </p>
        </div>
      </div>

      {/* Liderança Nacional */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Liderança Nacional
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Nossa equipe de liderança nacional trabalha incansavelmente para 
              promover os valores e objetivos do partido ANAMOLA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lideres.slice(0, 3).map((lider, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="h-64 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-4xl">👤</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {lider.nome}
                  </h3>
                  <p className="text-blue-600 font-medium mb-3">
                    {lider.cargo}
                  </p>
                  <p className="text-gray-600 mb-4">
                    {lider.bio}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {lider.provincias.map((provincia, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {provincia}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coordenadores Regionais */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Coordenadores Regionais
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Nossos coordenadores regionais trabalham diretamente com as comunidades 
              para implementar as políticas e programas do partido.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lideres.slice(3).map((lider, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="h-64 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-4xl">👤</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {lider.nome}
                  </h3>
                  <p className="text-blue-600 font-medium mb-3">
                    {lider.cargo}
                  </p>
                  <p className="text-gray-600 mb-4">
                    {lider.bio}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {lider.provincias.map((provincia, idx) => (
                      <span key={idx} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        {provincia}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">6</div>
              <div className="text-gray-600">Líderes Nacionais</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10</div>
              <div className="text-gray-600">Províncias</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Coordenadores Locais</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-gray-600">Membros Ativos</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}