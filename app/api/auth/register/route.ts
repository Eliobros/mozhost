import { connectMongo } from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "@/models/User"

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"
const BREVO_API_KEY = process.env.BREVO_API_KEY!

async function sendVerificationEmail(user: { _id: any; email: string; name?: string }) {
  const token = jwt.sign({ userId: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: "5m" })
  const verificationLink = `https://topaziocoin.online/api/verify-email?token=${token}`
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
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(requestBody),
  })
  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || "Erro ao enviar e-mail.")
  }
}

export async function POST(req: Request) {
  try {
    await connectMongo()
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: "Todos os campos são obrigatórios" }), { status: 400 })
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
      return new Response(JSON.stringify({ error: "Usuário já existe" }), { status: 409 })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    })

    await sendVerificationEmail({ _id: newUser._id, email, name })

    return new Response(JSON.stringify({ message: "Usuário criado com sucesso! Verifique seu e-mail." }), {
      status: 201,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Erro: " + error.message }), { status: 500 })
  }
}
