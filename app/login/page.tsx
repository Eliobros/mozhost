"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: "Sucesso!",
          description: data.message,
          variant: "default",
        })
        router.push("/dashboard") // Redirecionar para o dashboard após o login
      } else {
        toast({
          title: "Erro ao fazer login",
          description: data.error || "Ocorreu um erro inesperado.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro de rede ou servidor:", error)
      toast({
        title: "Erro",
        description: "Não foi possível conectar ao servidor. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-gradient-to-br from-[#e0e7ff] to-[#c7d2fe] px-4 dark:from-gray-900 dark:to-gray-950">
      <Card className="w-full max-w-md bg-gray-900 text-white shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Entrar no MozHost</CardTitle>
          <CardDescription className="text-gray-300">
            Entre com suas credenciais para acessar sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Link
            href="/forgot-password"
            className="text-sm underline text-blue-400 hover:text-blue-300"
            prefetch={false}
          >
            Esqueceu sua senha?
          </Link>
          <div className="text-sm">
            Não tem uma conta?{" "}
            <Link href="/register" className="underline text-blue-400 hover:text-blue-300" prefetch={false}>
              Cadastre-se
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
