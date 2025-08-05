"use client"

import { useState, useEffect } from "react"
import { CheckCircleIcon, XCircleIcon, Loader2Icon } from "lucide-react"

interface DirectoryStatusProps {
  currentDirectory: string
  serverId: string
  dockerContainerId: string
}

export function DirectoryStatus({ currentDirectory, serverId, dockerContainerId }: DirectoryStatusProps) {
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkDirectory = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/servers/${serverId}/terminal`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            command: `test -d "${currentDirectory}" && echo "valid" || echo "invalid"`, 
            dockerContainerId,
            currentDirectory: "/" 
          }),
        })
        
        const data = await res.json()
        
        if (res.ok && data.stdout?.includes("valid")) {
          setIsValid(true)
        } else {
          setIsValid(false)
        }
      } catch (error) {
        setIsValid(false)
      } finally {
        setLoading(false)
      }
    }

    if (currentDirectory) {
      checkDirectory()
    }
  }, [currentDirectory, serverId, dockerContainerId])

  if (loading) {
    return (
      <div className="flex items-center gap-1 text-xs text-gray-400">
        <Loader2Icon className="h-3 w-3 animate-spin" />
        Verificando...
      </div>
    )
  }

  if (isValid === null) {
    return null
  }

  return (
    <div className="flex items-center gap-1 text-xs">
      {isValid ? (
        <>
          <CheckCircleIcon className="h-3 w-3 text-green-400" />
          <span className="text-green-400">Válido</span>
        </>
      ) : (
        <>
          <XCircleIcon className="h-3 w-3 text-red-400" />
          <span className="text-red-400">Inválido</span>
        </>
      )}
    </div>
  )
}