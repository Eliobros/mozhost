import { connectMongo } from "@/lib/mongodb"
import User from "@/models/User"
import Server from "@/models/Server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"
const CMS_API_URL = process.env.CMS_API_URL || "http://localhost:3001" // URL do seu CMS na VPS
const MOZHOST_BEARER_TOKEN = process.env.MOZHOST_BEARER_TOKEN || ""

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectMongo()
    const serverId = params.id
    const { searchParams } = new URL(req.url)
    const filePath = searchParams.get("path") || "" // Caminho do arquivo/diretório a ser listado/lido

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

    if (!server.dockerContainerId) {
      return NextResponse.json({ error: "Contêiner Docker não associado a este servidor." }, { status: 400 })
    }

    // 3. Chamar o CMS para listar/ler arquivos
    try {
      const cmsResponse = await fetch(`${CMS_API_URL}/files/${server._id}?path=${encodeURIComponent(filePath)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MOZHOST_BEARER_TOKEN}`,
        },
      })

      if (!cmsResponse.ok) {
        const errorData = await cmsResponse.json()
        console.error("Erro ao chamar CMS para listar/ler arquivos:", errorData)
        return NextResponse.json(
          { error: `Erro ao acessar arquivos do servidor: ${errorData.message || "Erro desconhecido do CMS"}` },
          { status: 500 },
        )
      }

      const cmsResult = await cmsResponse.json()
      return NextResponse.json(cmsResult, { status: 200 })
    } catch (cmsError: any) {
      console.error("Erro de conexão com o CMS ao listar/ler arquivos:", cmsError)
      return NextResponse.json(
        { error: "Não foi possível conectar ao serviço de gerenciamento de arquivos." },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("Erro na API de listar/ler arquivos:", error)
    return NextResponse.json({ error: "Erro interno do servidor: " + error.message }, { status: 500 })
  }
}
