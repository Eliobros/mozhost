"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2Icon, FolderIcon, TerminalIcon } from "lucide-react"
import { TerminalShortcuts } from "./terminal-shortcuts"
import { CurrentDirectory } from "./current-directory"
import { TerminalHelp } from "./terminal-help"
import { TerminalOutput } from "./terminal-output"

interface ServerTerminalProps {
  serverId: string
  dockerContainerId: string
}

interface TerminalSession {
  currentDirectory: string
  commandHistory: string[]
  historyIndex: number
}

export function ServerTerminal({ serverId, dockerContainerId }: ServerTerminalProps) {
  const [command, setCommand] = useState("")
  const [output, setOutput] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState<TerminalSession>({
    currentDirectory: "/",
    commandHistory: [],
    historyIndex: -1,
  })
  const outputRef = useRef<HTMLPreElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Inicializar terminal com informações do diretório atual
  useEffect(() => {
    executeCommand("pwd", true) // Executar pwd silenciosamente para obter diretório inicial
  }, [])

  const executeCommand = async (commandToExecute: string, silent: boolean = false) => {
    if (!commandToExecute.trim() || loading) return

    if (!silent) {
      setCommand("") // Clear input immediately
      setLoading(true)
      setOutput((prev) => [...prev, `\n$ ${commandToExecute}`]) // Add command to output
    }

    try {
      // Preparar comando com contexto do diretório atual
      let fullCommand = commandToExecute
      
      // Se o comando for cd, atualizar o diretório localmente primeiro
      if (commandToExecute.startsWith("cd ")) {
        const newDir = commandToExecute.substring(3).trim()
        if (newDir === "..") {
          const parts = session.currentDirectory.split("/").filter(Boolean)
          parts.pop()
          setSession(prev => ({
            ...prev,
            currentDirectory: "/" + parts.join("/")
          }))
        } else if (newDir.startsWith("/")) {
          setSession(prev => ({
            ...prev,
            currentDirectory: newDir
          }))
        } else {
          const newPath = session.currentDirectory.endsWith("/") 
            ? session.currentDirectory + newDir
            : session.currentDirectory + "/" + newDir
          setSession(prev => ({
            ...prev,
            currentDirectory: newPath
          }))
        }
        
        if (!silent) {
          setOutput((prev) => [...prev, ""])
          setLoading(false)
          return
        }
      }

      // Para comandos que precisam do contexto do diretório
      if (commandToExecute === "ls" || commandToExecute === "ls -la" || commandToExecute === "dir") {
        fullCommand = `cd ${session.currentDirectory} && ${commandToExecute}`
      } else if (commandToExecute === "pwd") {
        fullCommand = `cd ${session.currentDirectory} && pwd`
      } else if (!commandToExecute.startsWith("cd ")) {
        // Para outros comandos, executar no diretório atual
        fullCommand = `cd ${session.currentDirectory} && ${commandToExecute}`
      }

      const res = await fetch(`/api/servers/${serverId}/terminal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          command: fullCommand, 
          dockerContainerId,
          currentDirectory: session.currentDirectory 
        }),
      })

      const data = await res.json()

      if (res.ok) {
        let outputText = data.stdout || ""
        let errorText = data.stderr || ""
        
        // Processar saída especial para pwd
        if (commandToExecute === "pwd" && !silent) {
          const pwdOutput = outputText.trim()
          if (pwdOutput) {
            setSession(prev => ({
              ...prev,
              currentDirectory: pwdOutput
            }))
          }
        }

        // Adicionar saída formatada
        if (!silent) {
          const newOutput = []
          if (outputText) newOutput.push(outputText)
          if (errorText) newOutput.push(`\x1b[31m${errorText}\x1b[0m`) // Vermelho para erros
          
          setOutput((prev) => [...prev, ...newOutput])
          
          // Adicionar ao histórico
          setSession(prev => ({
            ...prev,
            commandHistory: [...prev.commandHistory, commandToExecute],
            historyIndex: -1
          }))
        } else if (commandToExecute === "pwd") {
          const pwdOutput = outputText.trim()
          if (pwdOutput) {
            setSession(prev => ({
              ...prev,
              currentDirectory: pwdOutput
            }))
          }
        }
      } else {
        if (!silent) {
          toast({
            title: "Erro ao executar comando",
            description: data.error || "Ocorreu um erro inesperado.",
            variant: "destructive",
          })
          setOutput((prev) => [...prev, `\x1b[31mErro: ${data.error || "Erro desconhecido"}\x1b[0m`])
        }
      }
    } catch (error) {
      if (!silent) {
        console.error("Erro de rede ao executar comando:", error)
        toast({
          title: "Erro",
          description: "Não foi possível conectar ao servidor para executar o comando.",
          variant: "destructive",
        })
        setOutput((prev) => [...prev, "\x1b[31mErro de rede: Não foi possível conectar ao servidor.\x1b[0m"])
      }
    } finally {
      if (!silent) {
        setLoading(false)
      }
    }
  }

  const handleExecuteCommand = async (e: React.FormEvent) => {
    e.preventDefault()
    await executeCommand(command.trim())
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (session.historyIndex < session.commandHistory.length - 1) {
        const newIndex = session.historyIndex + 1
        setSession(prev => ({ ...prev, historyIndex: newIndex }))
        setCommand(session.commandHistory[session.commandHistory.length - 1 - newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (session.historyIndex > 0) {
        const newIndex = session.historyIndex - 1
        setSession(prev => ({ ...prev, historyIndex: newIndex }))
        setCommand(session.commandHistory[session.commandHistory.length - 1 - newIndex])
      } else if (session.historyIndex === 0) {
        setSession(prev => ({ ...prev, historyIndex: -1 }))
        setCommand("")
      }
    }
  }

  const clearTerminal = () => {
    setOutput([])
  }

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleHelpCommand = (command: string) => {
    setCommand(command)
    focusInput()
  }

  // Scroll to bottom of output whenever it changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <>
      <TerminalShortcuts onClear={clearTerminal} onFocus={focusInput} />
      <Card className="w-full max-w-4xl bg-gray-900 text-gray-50 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TerminalIcon className="h-5 w-5 text-green-400" />
            <CardTitle className="text-xl font-bold">Terminal do Servidor</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <CurrentDirectory path={session.currentDirectory} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col h-[500px]">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-gray-400">
            Use ↑↓ para navegar no histórico • Ctrl+L para limpar
          </div>
          <div className="flex gap-2">
            <TerminalHelp onCommand={handleHelpCommand} />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearTerminal}
              className="text-xs h-7 px-2"
            >
              Limpar
            </Button>
          </div>
        </div>
        <pre
          ref={outputRef}
          className="flex-1 bg-black text-green-400 p-4 rounded-md overflow-auto font-mono text-sm whitespace-pre-wrap break-words border border-gray-700"
        >
          {output.length === 0 && (
            <div className="text-gray-500 italic">
              Terminal inicializado. Digite 'help' para ver comandos disponíveis.
            </div>
          )}
          <TerminalOutput lines={output} />
          {loading && (
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2Icon className="h-4 w-4 animate-spin" /> Executando...
            </div>
          )}
        </pre>
        <form onSubmit={handleExecuteCommand} className="mt-4 flex gap-2">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-green-400 font-mono text-sm">$</span>
            <Input
              ref={inputRef}
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite seu comando aqui..."
              className="flex-1 bg-gray-800 text-gray-50 border-gray-700 focus-visible:ring-blue-500 font-mono"
              disabled={loading}
            />
          </div>
          <Button type="submit" disabled={loading} className="min-w-[100px]">
            {loading ? "Executando..." : "Executar"}
          </Button>
        </form>
      </CardContent>
    </Card>
    </>
  )
}
