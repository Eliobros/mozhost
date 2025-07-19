import { connectMongo } from "@/lib/mongodb"
import jwt from "jsonwebtoken"
import User from "@/models/User" // Importar o modelo User

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"

export async function POST(req: Request) {
  try {
    await connectMongo()
    const { email } = await req.json()

    if (!email) return new Response(JSON.stringify({ error: "Email obrigatório." }), { status: 400 })

    const user = await User.findOne({ email }) // Usar o modelo User
    if (!user) return new Response(JSON.stringify({ error: "Usuário não encontrado." }), { status: 404 })

    if (user.verified) {
      return new Response(JSON.stringify({ message: "Sua conta já está verificada." }), { status: 200 })
    }

    const token = jwt.sign({ userId: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: "5m" })
    const verificationLink = `https://topaziocoin.online/api/verify-email?token=${token}`
    const brevoApiKey = process.env.BREVO_API_KEY

    if (!brevoApiKey) {
      return new Response(JSON.stringify({ error: "API key Brevo não configurada." }), { status: 500 })
    }

    const emailBody = `
      <p>Olá,</p>
      <p>Clique no link abaixo para verificar seu e-mail e concluir o cadastro:</p>
      <a href="${verificationLink}">${verificationLink}</a>
      <p>O link expira em 5 minutos.</p>
    `
    const requestBody = {
      sender: { name: "MozHost", email: "eliobrostech@topaziocoin.online" },
      to: [{ email: user.email, name: user.name || "Usuário" }],
      subject: "Verifique seu e-mail - MozHost",
      htmlContent: emailBody,
      textContent: `Verifique seu e-mail com este link: ${verificationLink} (expira em 5 minutos).`,
    }

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": brevoApiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    if (!res.ok) {
      const errorData = await res.json()
      return new Response(JSON.stringify({ error: errorData.message || "Erro ao enviar e-mail." }), { status: 500 })
    }

    return new Response(JSON.stringify({ message: "Link de verificação enviado com sucesso!" }), { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: "Erro ao enviar e-mail." }), { status: 500 })
  }
}
