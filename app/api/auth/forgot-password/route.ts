import { connectMongo } from '@/lib/mongodb'
import crypto from 'crypto'
import { sendEmail } from '@/lib/mailer'
import mongoose from 'mongoose'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) {
      return new Response(JSON.stringify({ error: 'Email é obrigatório' }), { status: 400 })
    }

    await connectMongo()
    const User = mongoose.model('User')

    const user = await User.findOne({ email })
    if (!user) {
      return new Response(JSON.stringify({ message: 'Se o e-mail existir, uma mensagem foi enviada.' }), { status: 200 })
    }

    // Criar token
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

    user.resetPasswordToken = token
    user.resetPasswordExpires = expires
    await user.save()

    const resetLink = `https://mozhost.topaziocoin.online/reset-password?token=${token}`
    await sendEmail({
      to: email,
      subject: 'Redefinição de Senha',
      html: `
        <p>Você solicitou uma redefinição de senha.</p>
        <p><a href="${resetLink}">Clique aqui para redefinir</a></p>
        <p>Esse link expira em 1 hora.</p>
      `
    })

    return new Response(JSON.stringify({ message: 'Verifique seu e-mail para redefinir a senha.' }), { status: 200 })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Erro: ' + err.message }), { status: 500 })
  }
}
