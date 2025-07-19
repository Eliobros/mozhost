import { connectMongo } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json()

    if (!token || !newPassword) {
      return new Response(JSON.stringify({ error: 'Token e nova senha são obrigatórios' }), { status: 400 })
    }

    await connectMongo()
    const User = mongoose.model('User')

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() } // ainda válido
    })

    if (!user) {
      return new Response(JSON.stringify({ error: 'Token inválido ou expirado' }), { status: 400 })
    }

    const hashed = await bcrypt.hash(newPassword, 10)

    user.password = hashed
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined

    await user.save()

    return new Response(JSON.stringify({ message: 'Senha redefinida com sucesso' }), { status: 200 })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Erro: ' + err.message }), { status: 500 })
  }
}
