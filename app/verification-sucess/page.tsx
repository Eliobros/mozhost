"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function VerifiedSuccess() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const status = searchParams.get("status")

  const [message, setMessage] = useState("")

  useEffect(() => {
    switch (status) {
      case "success":
        setMessage("🎉 Seu e-mail foi verificado com sucesso! Agora você pode usar sua conta normalmente.")
        break
      case "already-verified":
        setMessage("✅ Seu e-mail já estava verificado. Obrigado por confirmar novamente!")
        break
      case "error":
      default:
        setMessage("❌ Ocorreu um erro na verificação do seu e-mail. Por favor, tente novamente ou solicite um novo link.")
        break
    }
  }, [status])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Verificação de E-mail</h1>
        <p className="text-gray-700">{message}</p>

        {status === "error" && (
          <button
            onClick={() => router.push("/resend-verification")} // ou para onde quiser
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Solicitar novo link de verificação
          </button>
        )}
      </div>
    </main>
  )
}
