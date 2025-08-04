"use client"

interface TerminalOutputProps {
  lines: string[]
}

export function TerminalOutput({ lines }: TerminalOutputProps) {
  const formatLine = (line: string) => {
    // Remover códigos ANSI de cor
    const cleanLine = line.replace(/\x1b\[[0-9;]*m/g, '')
    
    // Detectar tipos de conteúdo
    if (line.includes('\x1b[31m')) {
      return <span className="text-red-400">{cleanLine}</span>
    }
    
    if (line.includes('\x1b[32m')) {
      return <span className="text-green-400">{cleanLine}</span>
    }
    
    if (line.includes('\x1b[33m')) {
      return <span className="text-yellow-400">{cleanLine}</span>
    }
    
    if (line.includes('\x1b[34m')) {
      return <span className="text-blue-400">{cleanLine}</span>
    }
    
    // Detectar diretórios (terminam com /)
    if (cleanLine.match(/[^\/]+\/$/)) {
      return <span className="text-blue-400">{cleanLine}</span>
    }
    
    // Detectar arquivos executáveis (terminam com *)
    if (cleanLine.includes('*')) {
      return <span className="text-green-400">{cleanLine}</span>
    }
    
    // Detectar links simbólicos (terminam com @)
    if (cleanLine.includes('@')) {
      return <span className="text-cyan-400">{cleanLine}</span>
    }
    
    // Detectar comandos (começam com $)
    if (cleanLine.startsWith('$ ')) {
      return <span className="text-yellow-400 font-semibold">{cleanLine}</span>
    }
    
    // Detectar erros
    if (cleanLine.toLowerCase().includes('error') || cleanLine.toLowerCase().includes('erro')) {
      return <span className="text-red-400">{cleanLine}</span>
    }
    
    // Detectar warnings
    if (cleanLine.toLowerCase().includes('warning') || cleanLine.toLowerCase().includes('aviso')) {
      return <span className="text-yellow-400">{cleanLine}</span>
    }
    
    return <span className="text-green-400">{cleanLine}</span>
  }

  return (
    <div className="space-y-0">
      {lines.map((line, index) => (
        <div key={index} className="whitespace-pre-wrap">
          {formatLine(line)}
        </div>
      ))}
    </div>
  )
}