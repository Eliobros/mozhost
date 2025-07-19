import { connectMongo } from "@/lib/mongodb"
import User from "@/models/User" // Importar o modelo User diretamente
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"

export async function GET() {
  try {
    await connectMongo()
    const token = (await cookies()).get("token")?.value
    if (!token) return new Response(JSON.stringify({ error: "Não autenticado" }), { status: 401 })

    let decoded: any
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return new Response(JSON.stringify({ error: "Token inválido ou expirado" }), { status: 401 })
    }

    const user = await User.findById(decoded.userId)
    if (!user) return new Response(JSON.stringify({ error: "Usuário não encontrado" }), { status: 404 })

    return new Response(JSON.stringify({ coins: user.coins }), { status: 200 })
  } catch (err: any) {
    console.error("Erro ao obter coins:", err)
    return new Response(JSON.stringify({ error: "Erro ao obter coins: " + err.message }), { status: 500 })
  }
}
