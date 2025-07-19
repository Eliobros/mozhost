import { connectMongo } from '@/lib/mongodb'
import mongoose from 'mongoose'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'

export async function GET() {
  try {
    await connectMongo()
    const token =  (await cookies()).get('token')?.value
    if (!token) return new Response(JSON.stringify({ error: 'Não autenticado' }), { status: 401 })

    const decoded: any = jwt.verify(token, JWT_SECRET)
    const User = mongoose.model('User')
    const user = await User.findById(decoded.userId)

    if (!user) return new Response(JSON.stringify({ error: 'Usuário não encontrado' }), { status: 404 })

    return new Response(JSON.stringify({ coins: user.coins }), { status: 200 })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Erro: ' + err.message }), { status: 500 })
  }
}
