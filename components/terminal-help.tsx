"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircleIcon, XIcon } from "lucide-react"

interface TerminalHelpProps {
  onCommand: (command: string) => void
}

const usefulCommands = [
  { name: "Navegação", commands: [
    { cmd: "pwd", desc: "Mostra o diretório atual" },
    { cmd: "ls", desc: "Lista arquivos e pastas" },
    { cmd: "ls -la", desc: "Lista arquivos com detalhes" },
    { cmd: "cd pasta", desc: "Entra em uma pasta" },
    { cmd: "cd ..", desc: "Volta para pasta anterior" },
    { cmd: "cd /", desc: "Vai para a raiz" }
  ]},
  { name: "Arquivos", commands: [
    { cmd: "mkdir pasta", desc: "Cria uma nova pasta" },
    { cmd: "touch arquivo.txt", desc: "Cria um arquivo vazio" },
    { cmd: "cat arquivo.txt", desc: "Mostra conteúdo do arquivo" },
    { cmd: "nano arquivo.txt", desc: "Edita arquivo" },
    { cmd: "rm arquivo.txt", desc: "Remove arquivo" },
    { cmd: "rm -rf pasta", desc: "Remove pasta e conteúdo" }
  ]},
  { name: "Sistema", commands: [
    { cmd: "ps aux", desc: "Mostra processos em execução" },
    { cmd: "top", desc: "Monitor de sistema" },
    { cmd: "df -h", desc: "Mostra espaço em disco" },
    { cmd: "free -h", desc: "Mostra uso de memória" },
    { cmd: "whoami", desc: "Mostra usuário atual" },
    { cmd: "date", desc: "Mostra data e hora" }
  ]}
]

export function TerminalHelp({ onCommand }: TerminalHelpProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleCommandClick = (command: string) => {
    onCommand(command)
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="text-xs h-7 px-2"
      >
        <HelpCircleIcon className="h-3 w-3 mr-1" />
        Ajuda
      </Button>
    )
  }

  return (
    <Card className="absolute top-0 left-0 w-96 max-h-96 bg-gray-800 text-gray-50 z-50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Comandos Úteis</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-6 w-6 p-0"
          >
            <XIcon className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="max-h-80 overflow-y-auto">
        <div className="space-y-4">
          {usefulCommands.map((category) => (
            <div key={category.name}>
              <h4 className="text-xs font-semibold text-blue-400 mb-2 uppercase tracking-wide">
                {category.name}
              </h4>
              <div className="space-y-1">
                {category.commands.map((command) => (
                  <div
                    key={command.cmd}
                    className="flex items-center justify-between p-2 rounded hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleCommandClick(command.cmd)}
                  >
                    <code className="text-xs text-green-400 font-mono">
                      {command.cmd}
                    </code>
                    <span className="text-xs text-gray-400 ml-2">
                      {command.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}