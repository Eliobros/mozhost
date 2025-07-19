"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Suspense } from "react"

function VerifiedSuccessInner() {
  const searchParams = useSearchParams()
  const status = searchParams.get("status")
  const [message, setMessage] = useState("")

  useEffect(() => {
    switch (status) {
      case "success":
        setMessage("🎉 Seu e-mail foi verificado com sucesso!")
        break
      case "already-verified":
        setMessage("✅ Seu e-mail já estava verificado.")
        break
      case "error":
      default:
        setMessage("❌ Erro na verificação. Link inválido ou expirado.")
        break
    }
  }, [status])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow text-center">
        <h1 className="text-2xl font-bold mb-4">Verificação de E-mail</h1>
        <p>{message}</p>
      </div>
    </main>
  )
}

// Componente exportado com suspense (obrigatório no app router para evitar erro  ⨯ useSearchParams())
export default function VerifiedSuccessPageWrapper() {
  return (
    <Suspense fallback={<div className="text-center p-4">Carregando...</div>}>
      <VerifiedSuccessInner />
    </Suspense>
  )
}
