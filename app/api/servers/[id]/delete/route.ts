import { connectMongo } from "@/lib/mongodb"
import User from "@/models/User"
import Server from "@/models/Server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"
const CMS_API_URL = process.env.CMS_API_URL || "http://localhost:3001/api" // URL do seu CMS na VPS

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
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

    // 3. Chamar o CMS para deletar o contêiner
    // Adicione esta verificação antes do bloco try...catch do fetch para o CMS
    if (!server.dockerContainerId) {
      // Se não há ID de contêiner Docker, significa que ele nunca foi criado no Docker.
      // Apenas removemos o registro do MongoDB.
      await Server.deleteOne({ _id: serverId })
      return NextResponse.json({ message: "Servidor deletado com sucesso (contêiner não existia)." }, { status: 200 })
    }

    try {
      const cmsResponse = await fetch(`${CMS_API_URL}/delete-container`, {
        method: "POST", // Ou DELETE, dependendo da sua implementação do CMS
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': `Bearer ${process.env.MOZHOST_BEARER_TOKEN}` // Se o CMS exigir autenticação
        },
        body: JSON.stringify({ containerId: server.dockerContainerId }),
      })

      if (!cmsResponse.ok) {
        const errorData = await cmsResponse.json()
        console.error("Erro ao chamar CMS para deletar:", errorData)
        server.status = "error" // Marcar como erro se o CMS falhar
        await server.save()
        return NextResponse.json(
          { error: `Erro ao deletar servidor: ${errorData.message || "Erro desconhecido do CMS"}` },
          { status: 500 },
        )
      }

      // 4. Remover o servidor do MongoDB
      await Server.deleteOne({ _id: serverId })

      return NextResponse.json({ message: "Servidor deletado com sucesso." }, { status: 200 })
    } catch (cmsError: any) {
      console.error("Erro de conexão com o CMS ao deletar servidor:", cmsError)
      server.status = "error" // Se a conexão falhar antes de deletar do DB
      await server.save()
      return NextResponse.json(
        { error: "Não foi possível conectar ao serviço de gerenciamento de servidores." },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("Erro na API de deletar servidor:", error)
    return NextResponse.json({ error: "Erro interno do servidor: " + error.message }, { status: 500 })
  }
}
