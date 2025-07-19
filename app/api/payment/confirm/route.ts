import { connectMongo } from '@/lib/mongodb'
import User from '@/models/User'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ message: 'ID do usuário ausente' }, { status: 400 })

    await connectMongo()
    const user = await User.findById(userId)
    if (!user) return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 })
    user.coins += 500 // adicionar coins após pagamento
    await user.save()

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: 'Erro: ' + err.message }, { status: 500 })
  }
}
