import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    (await cookies()).delete("token") // Remove o cookie do token
    return NextResponse.json({ message: "Desconectado com sucesso." }, { status: 200 })
  } catch (error) {
    console.error("Erro ao desconectar:", error)
    return NextResponse.json({ error: "Erro ao desconectar." }, { status: 500 })
  }
}
