import { connectMongo } from "@/lib/mongodb"
import User from "@/models/User"
import Server from "@/models/Server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"
const CMS_API_URL = process.env.CMS_API_URL || "http://localhost:3001/api" // URL do seu CMS na VPS
const MOZHOST_BEARER_TOKEN = process.env.MOZHOST_BEARER_TOKEN || "4fT9xZq7LpW2vBj" // Token de autenticação para o CMS

export async function POST(req: Request) {
  try {
    await connectMongo()

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

    // 2. Obter dados do corpo da requisição
    const { name, image = "ubuntu:latest", ports = [], allocatedCpu = 0.5, allocatedMemory = 512 } = await req.json()

    if (!name) {
      return NextResponse.json({ error: "Nome do servidor é obrigatório." }, { status: 400 })
    }

    // 3. Verificar limite de servidores (2 por usuário)
    const userServersCount = await Server.countDocuments({ userId })
    if (userServersCount >= 2) {
      return NextResponse.json({ error: "Você atingiu o limite de 2 servidores por conta." }, { status: 403 })
    }

    // 4. Criar registro do servidor no MongoDB com status 'creating'
    const newServer = await Server.create({
      userId,
      name,
      image,
      ports,
      allocatedCpu,
      allocatedMemory,
      status: "creating", // Inicialmente em status de criação
    })

    // 5. Chamar o Serviço de Gerenciamento de Contêineres (CMS) na VPS
    // ESTE É UM PLACEHOLDER. VOCÊ VAI IMPLEMENTAR O CMS NA SUA VPS.
    try {
      const cmsResponse = await fetch(`${CMS_API_URL}/servers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MOZHOST_BEARER_TOKEN}`,
        },
        body: JSON.stringify({
          serverId: newServer._id.toString(),
          imageName: image, // Use imageName em vez de image para corresponder ao CMS
          name: `mozhost_${newServer._id.toString()}`,
          ports,
          allocatedCpu,
          allocatedMemory,
        }),
      })

      if (!cmsResponse.ok) {
        const errorData = await cmsResponse.json()
        console.error("Erro ao chamar CMS:", errorData)
        // Atualizar status do servidor para 'error' se o CMS falhar
        newServer.status = "error"
        await newServer.save()
        return NextResponse.json(
          { error: `Erro ao provisionar servidor: ${errorData.message || "Erro desconhecido do CMS"}` },
          { status: 500 },
        )
      }

      const cmsResult = await cmsResponse.json()
      // Atualizar o registro do servidor com o ID do contêiner Docker e status 'running'
      newServer.dockerContainerId = cmsResult.containerId
      newServer.fileSystemPath = cmsResult.fileSystemPath // Se o CMS retornar o caminho
      newServer.status = "running" // Ou 'provisioning' se o CMS for assíncrono
      await newServer.save()

      return NextResponse.json(
        { message: "Servidor criado e provisionado com sucesso!", server: newServer },
        { status: 201 },
      )
    } catch (cmsError: any) {
      console.error("Erro de conexão com o CMS:", cmsError)
      // Atualizar status do servidor para 'error' se a conexão com o CMS falhar
      newServer.status = "error"
      await newServer.save()
      return NextResponse.json(
        { error: "Não foi possível conectar ao serviço de provisionamento de servidores." },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("Erro na API de criação de servidor:", error)
    return NextResponse.json({ error: "Erro interno do servidor: " + error.message }, { status: 500 })
  }
}
