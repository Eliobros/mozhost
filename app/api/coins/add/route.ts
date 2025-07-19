import { connectMongo } from "@/lib/mongodb"
import User from "@/models/User" // Importar o modelo User diretamente

export async function POST(req: Request) {
  try {
    const { userId, amount } = await req.json()
    if (!userId || !amount) {
      return new Response(JSON.stringify({ error: "userId e amount são obrigatórios" }), { status: 400 })
    }

    await connectMongo()
    const user = await User.findById(userId)
    if (!user) return new Response(JSON.stringify({ error: "Usuário não encontrado" }), { status: 404 })

    user.coins += amount
    await user.save()

    return new Response(JSON.stringify({ message: "Coins adicionadas", coins: user.coins }), { status: 200 })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: "Erro: " + err.message }), { status: 500 })
  }
}
