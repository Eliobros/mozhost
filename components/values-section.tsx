import React from 'react'

const values = [
  {
    icon: '🏛️',
    title: 'Democracia',
    description: 'Defendemos a democracia como base fundamental para o desenvolvimento político e social de Moçambique.'
  },
  {
    icon: '🤝',
    title: 'Unidade',
    description: 'Promovemos a unidade nacional, respeitando a diversidade cultural e étnica do nosso país.'
  },
  {
    icon: '📈',
    title: 'Desenvolvimento',
    description: 'Trabalhamos pelo desenvolvimento económico sustentável e inclusivo para todos os moçambicanos.'
  },
  {
    icon: '⚖️',
    title: 'Justiça Social',
    description: 'Lutamos pela igualdade de oportunidades e justiça social para todos os cidadãos.'
  },
  {
    icon: '🌱',
    title: 'Sustentabilidade',
    description: 'Comprometemo-nos com o desenvolvimento sustentável e a proteção do meio ambiente.'
  },
  {
    icon: '🎓',
    title: 'Educação',
    description: 'Priorizamos a educação como pilar fundamental para o progresso da nação.'
  }
]

export default function ValuesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nossos Valores e Princípios
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            O ANAMOLA é guiado por valores fundamentais que orientam nossa missão 
            de construir um Moçambique mais próspero e justo para todos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {value.title}
              </h3>
              <p className="text-gray-600">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}