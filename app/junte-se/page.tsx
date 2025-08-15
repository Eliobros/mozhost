import JoinForm from '@/components/form-card'

export default function JunteSePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Junte-se ao ANAMOLA
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Faça parte do nosso movimento para construir um Moçambique melhor. 
            Preencha o formulário abaixo e torne-se um membro do partido ANAMOLA.
          </p>
        </div>
        
        <div className="flex justify-center">
          <JoinForm />
        </div>
      </div>
    </div>
  )
}