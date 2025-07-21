import { connectMongo } from "@/lib/mongodb"
import User from "@/models/User"
import Server from "@/models/Server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"
const CMS_API_URL = process.env.CMS_API_URL || "http://localhost:3001"
const CMS_AUTH_TOKEN = process.env.MOZHOST_BEARER_TOKEN || ""

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectMongo()
    const serverId = params.id
    const { path: newFilePath } = await req.json()

    if (!newFilePath) {
      return NextResponse.json({ error: "O caminho do novo arquivo é obrigatório." }, { status: 400 })
    }

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

    // 3. Chamar o CMS para criar o arquivo
    try {
      const cmsResponse = await fetch(`${CMS_API_URL}/files/${server._id}/file`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CMS_AUTH_TOKEN}`,
        },
        body: JSON.stringify({ path: newFilePath }),
      })

      if (!cmsResponse.ok) {
        const errorData = await cmsResponse.json()
        console.error("Erro ao chamar CMS para criar arquivo:", errorData)
        return NextResponse.json(
          { error: `Erro ao criar arquivo: ${errorData.message || "Erro desconhecido do CMS"}` },
          { status: 500 },
        )
      }

      const cmsResult = await cmsResponse.json()
      return NextResponse.json(cmsResult, { status: 201 })
    } catch (cmsError: any) {
      console.error("Erro de conexão com o CMS ao criar arquivo:", cmsError)
      return NextResponse.json(
        { error: "Não foi possível conectar ao serviço de gerenciamento de arquivos." },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("Erro na API de criar arquivo:", error)
    return NextResponse.json({ error: "Erro interno do servidor: " + error.message }, { status: 500 })
  }
}
