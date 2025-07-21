"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2Icon } from "lucide-react"

interface ServerTerminalProps {
  serverId: string
  dockerContainerId: string
}

export function ServerTerminal({ serverId, dockerContainerId }: ServerTerminalProps) {
  const [command, setCommand] = useState("")
  const [output, setOutput] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const outputRef = useRef<HTMLPreElement>(null)
  const { toast } = useToast()

  const handleExecuteCommand = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!command.trim() || loading) return

    const commandToExecute = command.trim()
    setCommand("") // Clear input immediately
    setLoading(true)
    setOutput((prev) => [...prev, `> ${commandToExecute}`]) // Add command to output

    try {
      const res = await fetch(`/api/servers/${serverId}/terminal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command: commandToExecute, dockerContainerId }),
      })

      const data = await res.json()

      if (res.ok) {
        setOutput((prev) => [...prev, data.stdout || "", data.stderr || ""])
      } else {
        toast({
          title: "Erro ao executar comando",
          description: data.error || "Ocorreu um erro inesperado.",
          variant: "destructive",
        })
        setOutput((prev) => [...prev, `Erro: ${data.error || "Erro desconhecido"}`])
      }
    } catch (error) {
      console.error("Erro de rede ao executar comando:", error)
      toast({
        title: "Erro",
        description: "Não foi possível conectar ao servidor para executar o comando.",
        variant: "destructive",
      })
      setOutput((prev) => [...prev, "Erro de rede: Não foi possível conectar ao servidor."])
    } finally {
      setLoading(false)
    }
  }

  // Scroll to bottom of output whenever it changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  return (
    <Card className="w-full max-w-4xl bg-gray-900 text-gray-50 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Terminal do Servidor</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-[500px]">
        <pre
          ref={outputRef}
          className="flex-1 bg-black text-green-400 p-4 rounded-md overflow-auto font-mono text-sm whitespace-pre-wrap break-words"
        >
          {output.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2Icon className="h-4 w-4 animate-spin" /> Executando...
            </div>
          )}
        </pre>
        <form onSubmit={handleExecuteCommand} className="mt-4 flex gap-2">
          <Input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Digite seu comando aqui..."
            className="flex-1 bg-gray-800 text-gray-50 border-gray-700 focus-visible:ring-blue-500"
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Executando..." : "Executar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
