import { NextResponse } from 'next/server'
import { connectMongo } from '@/lib/mongodb'
import Payment from '@/models/Payment'

export async function POST(req: Request) {
  try {
    const { numero, nome, meio_de_pagamento, email, userId } = await req.json()
    const carteira = process.env.MOZPAYMENT_CARTEIRA
    const valor = '10' // valor de teste fixo

    if (!numero || !nome || !meio_de_pagamento || !email || !userId) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    await connectMongo()

    const return_url = `https://mozhost.topaziocoin.online/payment/verified-status-payment?userId=${userId}`

    const res = await fetch('https://mozpayment.co.mz/api/1.1/wf/white-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        carteira,
        numero,
        nome,
        valor,
        meio_de_pagamento,
        email,
        return_url
      })
    })

    const paymentURL = await res.text()

    // Registrar no MongoDB
    await Payment.create({
      user: userId,
      amount: Number(valor),
      paymentMethod: meio_de_pagamento,
      status: 'pending'
    })

    return NextResponse.json({ url: paymentURL })

  } catch (err: any) {
    return NextResponse.json({ error: 'Erro ao iniciar pagamento: ' + err.message }, { status: 500 })
  }
}
