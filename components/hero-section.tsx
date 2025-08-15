import React from 'react'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black opacity-10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold text-3xl">A</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              ANAMOLA
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Partido Político para o Desenvolvimento de Moçambique
            </p>
          </div>

          {/* Slogan */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              Unidos por um Moçambique Melhor
            </h2>
            <p className="text-lg text-blue-100 max-w-3xl mx-auto">
              Trabalhamos para construir um futuro próspero, justo e sustentável 
              para todos os moçambicanos, promovendo o desenvolvimento social, 
              económico e político do nosso país.
            </p>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/junte-se"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 text-lg"
            >
              Junte-se ao Partido
            </Link>
            <Link
              href="/sobre"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200 text-lg"
            >
              Conheça Nossa História
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">+1000</div>
              <div className="text-blue-100">Membros Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">10</div>
              <div className="text-blue-100">Províncias</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">2024</div>
              <div className="text-blue-100">Ano de Fundação</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}