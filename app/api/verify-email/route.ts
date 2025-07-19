import { connectMongo } from "@/lib/mongodb"
import User from "@/models/User"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"

export async function GET(req: Request) {
  try {
    await connectMongo()
    const { searchParams } = new URL(req.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Token de verificação ausente." }, { status: 400 })
    }

    let decoded: any
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json({ error: "Token de verificação inválido ou expirado." }, { status: 401 })
    }

    const user = await User.findById(decoded.userId)

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 })
    }

    if (user.verified) {
      return NextResponse.json({ message: "Sua conta já foi verificada." }, { status: 200 })
    }

    user.verified = true
    await user.save()

    // Redirecionar para uma página de sucesso ou exibir uma mensagem
    // Você pode ajustar esta URL para a sua página de sucesso de verificação
    return NextResponse.redirect(new URL("/verification-success", req.url))
  } catch (error: any) {
    console.error("Erro na verificação de e-mail:", error)
    return NextResponse.json({ error: "Erro interno do servidor: " + error.message }, { status: 500 })
  }
}
