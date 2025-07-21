import { connectMongo } from "@/lib/mongodb"
import User from "@/models/User"
import Server from "@/models/Server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"
const CMS_API_URL = process.env.CMS_API_URL || "http://localhost:3001/api" // URL do seu CMS na VPS

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectMongo()
    const serverId = params.id

    // 1. Autenticação do Usuário
    const token = (await cookies()).get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    let decoded: any
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json({ error: "Token inválido ou expirado" }, { status: 401 })
    }

    const userId = decoded.userId
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    // 2. Encontrar o servidor e verificar propriedade
    const server = await Server.findOne({ _id: serverId, userId })
    if (!server) {
      return NextResponse.json({ error: "Servidor não encontrado ou você não tem permissão." }, { status: 404 })
    }

    if (server.status === "stopped") {
      return NextResponse.json({ message: "Servidor já está parado." }, { status: 200 })
    }

    // 3. Chamar o CMS para parar o contêiner
    try {
      const cmsResponse = await fetch(`${CMS_API_URL}/servers/${server.dockerContainerId}/stop`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MOZHOST_BEARER_TOKEN}`,
        },
        body: JSON.stringify({ containerId: server.dockerContainerId }),
      })

      if (!cmsResponse.ok) {
        const errorData = await cmsResponse.json()
        console.error("Erro ao chamar CMS para parar:", errorData)
        server.status = "error" // Marcar como erro se o CMS falhar
        await server.save()
        return NextResponse.json(
          { error: `Erro ao parar servidor: ${errorData.message || "Erro desconhecido do CMS"}` },
          { status: 500 },
        )
      }

      // 4. Atualizar status no MongoDB
      server.status = "stopped"
      await server.save()

      return NextResponse.json({ message: "Servidor parado com sucesso." }, { status: 200 })
    } catch (cmsError: any) {
      console.error("Erro de conexão com o CMS ao parar servidor:", cmsError)
      server.status = "error"
      await server.save()
      return NextResponse.json(
        { error: "Não foi possível conectar ao serviço de gerenciamento de servidores." },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("Erro na API de parar servidor:", error)
    return NextResponse.json({ error: "Erro interno do servidor: " + error.message }, { status: 500 })
  }
}
