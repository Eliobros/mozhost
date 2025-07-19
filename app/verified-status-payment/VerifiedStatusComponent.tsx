'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function VerifiedStatusComponent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('Verificando...')

  useEffect(() => {
    const userId = searchParams.get('user')
    if (!userId) {
      setStatus('Usuário não identificado. Pagamento não vinculado.')
      return
    }

    fetch('/api/payment/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatus('✅ Pagamento confirmado! Coins adicionados com sucesso.')
        } else {
          setStatus(`⚠️ ${data.message || 'Pagamento não confirmado.'}`)
        }
      })
      .catch(() => setStatus('Erro ao verificar pagamento.'))
  }, [])

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold">Status do Pagamento</h1>
      <p className="mt-4">{status}</p>
    </div>
  )
}
