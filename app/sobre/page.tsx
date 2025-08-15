export default function SobrePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Sobre o ANAMOLA
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Conheça nossa história, missão e os valores que nos guiam na construção 
            de um Moçambique mais próspero e justo.
          </p>
        </div>
      </div>

      {/* História */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Nossa História
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  O ANAMOLA foi fundado em 2024 com o objetivo de promover o desenvolvimento 
                  sustentável de Moçambique através de políticas inclusivas e democráticas.
                </p>
                <p>
                  Nossa jornada começou com um grupo de cidadãos comprometidos com a 
                  transformação social e económica do país, unidos pela visão de um 
                  Moçambique mais próspero e justo.
                </p>
                <p>
                  Desde então, temos trabalhado incansavelmente para construir uma 
                  base sólida de membros e apoiantes em todas as províncias do país.
                </p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-8">
              <div className="text-center">
                <div className="text-6xl mb-4">🏛️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Fundado em 2024
                </h3>
                <p className="text-gray-600">
                  Um novo capítulo na história política de Moçambique
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Missão e Visão */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nossa Missão</h3>
              <p className="text-gray-600">
                Promover o desenvolvimento sustentável de Moçambique através de políticas 
                inclusivas, democráticas e transparentes, trabalhando para melhorar a 
                qualidade de vida de todos os moçambicanos.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4">👁️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nossa Visão</h3>
              <p className="text-gray-600">
                Ser um partido político de referência em Moçambique, reconhecido pela 
                sua contribuição para o desenvolvimento nacional e pela promoção de 
                valores democráticos e de justiça social.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Objetivos */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nossos Objetivos
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Trabalhamos para alcançar objetivos específicos que beneficiem 
              diretamente o povo moçambicano.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Educação de Qualidade
              </h3>
              <p className="text-gray-600">
                Promover o acesso universal à educação de qualidade para todos os moçambicanos.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Emprego e Desenvolvimento
              </h3>
              <p className="text-gray-600">
                Criar oportunidades de emprego e fomentar o desenvolvimento económico local.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🏥</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Saúde Pública
              </h3>
              <p className="text-gray-600">
                Melhorar o acesso aos serviços de saúde em todo o território nacional.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🏘️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Habitação Digna
              </h3>
              <p className="text-gray-600">
                Promover políticas de habitação que garantam moradia digna para todos.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🛣️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Infraestruturas
              </h3>
              <p className="text-gray-600">
                Desenvolver infraestruturas modernas que conectem todo o país.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Cooperação Internacional
              </h3>
              <p className="text-gray-600">
                Fortalecer as relações internacionais para o desenvolvimento do país.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}