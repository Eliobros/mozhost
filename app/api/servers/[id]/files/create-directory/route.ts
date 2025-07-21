import { connectMongo } from "@/lib/mongodb"
import User from "@/models/User"
import Server from "@/models/Server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"
const CMS_API_URL = process.env.CMS_API_URL || "http://localhost:3001"
const MOZHOST_BEARER_TOKEN = process.env.MOZHOST_BEARER_TOKEN || ""

export async function POST(req: Request, context: any) {
  try {
    await connectMongo()

    const { params } = await context
    const serverId = params.id

    const { path: newDirPath } = await req.json()

    if (!newDirPath) {
      return NextResponse.json({ error: "O caminho do novo diretório é obrigatório." }, { status: 400 })
    }

    // Autenticação do Usuário
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

    // Encontrar o servidor e verificar propriedade
    const server = await Server.findOne({ _id: serverId, userId })
    if (!server) {
      return NextResponse.json({ error: "Servidor não encontrado ou você não tem permissão." }, { status: 404 })
    }

    // Chamar o CMS para criar o diretório
    try {
      const cmsResponse = await fetch(`${CMS_API_URL}/servers/${server._id}/files/create-directory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MOZHOST_BEARER_TOKEN}`,
        },
        body: JSON.stringify({ path: newDirPath }),
      })

      if (!cmsResponse.ok) {
        let errorText = await cmsResponse.text()
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { message: errorText }
        }
        console.error("Erro ao chamar CMS para criar diretório:", errorData)
        return NextResponse.json(
          { error: `Erro ao criar diretório: ${errorData.message || "Erro desconhecido do CMS"}` },
          { status: 500 }
        )
      }

      const cmsResult = await cmsResponse.json()
      return NextResponse.json(cmsResult, { status: 201 })
    } catch (cmsError: any) {
      console.error("Erro de conexão com o CMS ao criar diretório:", cmsError)
      return NextResponse.json(
        { error: "Não foi possível conectar ao serviço de gerenciamento de arquivos." },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error("Erro na API de criar diretório:", error)
    return NextResponse.json({ error: "Erro interno do servidor: " + error.message }, { status: 500 })
  }
}
