"use client"

import React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import {
  PlusIcon,
  RefreshCcwIcon,
  PlayIcon,
  MonitorStopIcon as StopIcon,
  RotateCcwIcon,
  Trash2Icon,
  TerminalIcon,
  FolderOpenIcon,
  EditIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Server {
  _id: string
  name: string
  status: "creating" | "running" | "stopped" | "error" | "deleting"
  image: string
  dockerContainerId?: string
  ports: { containerPort: number; hostPort: number }[]
  allocatedCpu: number
  allocatedMemory: number
  createdAt: string
}

export default function ServersPage() {
  const [servers, setServers] = useState<Server[]>([])
  const [loading, setLoading] = useState(true)
  const [creatingServer, setCreatingServer] = useState(false)
  const [newServerName, setNewServerName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const fetchServers = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/servers/list")
      if (res.ok) {
        const data = await res.json()
        setServers(data.servers)
      } else {
        const errorData = await res.json()
        toast({
          title: "Erro ao carregar servidores",
          description: errorData.error || "Não foi possível carregar seus servidores.",
          variant: "destructive",
        })
        if (res.status === 401) {
          router.push("/login")
        }
      }
    } catch (error) {
      console.error("Erro de rede ao carregar servidores:", error)
      toast({
        title: "Erro",
        description: "Não foi possível conectar ao servidor para carregar servidores.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServers()
  }, [])

  const handleCreateServer = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreatingServer(true)
    try {
      const res = await fetch("/api/servers/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newServerName }),
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: "Servidor Criado!",
          description: data.message,
          variant: "default",
        })
        setNewServerName("")
        setIsDialogOpen(false)
        fetchServers() // Recarregar a lista de servidores
      } else {
        toast({
          title: "Erro ao criar servidor",
          description: data.error || "Ocorreu um erro inesperado.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro de rede ao criar servidor:", error)
      toast({
        title: "Erro",
        description: "Não foi possível conectar ao servidor para criar o servidor.",
        variant: "destructive",
      })
    } finally {
      setCreatingServer(false)
    }
  }

  const handleAction = async (serverId: string, action: "start" | "stop" | "restart" | "delete") => {
    // Optimistic UI update
    setServers((prevServers) =>
      prevServers.map((server) =>
        server._id === serverId ? { ...server, status: action === "delete" ? "deleting" : "creating" } : server,
      ),
    )

    try {
      const method = action === "delete" ? "DELETE" : "POST"
      const res = await fetch(`/api/servers/${serverId}/${action}`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: "Sucesso!",
          description: data.message,
          variant: "default",
        })
        fetchServers() // Recarregar para atualizar status real
      } else {
        toast({
          title: `Erro ao ${action} servidor`,
          description: data.error || "Ocorreu um erro inesperado.",
          variant: "destructive",
        })
        fetchServers() // Recarregar para reverter status otimista
      }
    } catch (error) {
      console.error(`Erro de rede ao ${action} servidor:`, error)
      toast({
        title: "Erro",
        description: `Não foi possível conectar ao servidor para ${action} o servidor.`,
        variant: "destructive",
      })
      fetchServers() // Recarregar para reverter status otimista
    }
  }


  return (
    <div className="flex min-h-[calc(100dvh-64px)] flex-col items-center bg-gray-100 px-4 py-8 dark:bg-gray-950">
      <Card className="w-full max-w-4xl bg-white shadow-lg dark:bg-gray-900 dark:text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Meus Servidores</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={fetchServers} disabled={loading}>
              <RefreshCcwIcon className="h-4 w-4" />
              <span className="sr-only">Atualizar</span>
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button disabled={servers.length >= 2}>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Criar Novo Servidor
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white">
                <DialogHeader>
                  <DialogTitle>Criar Novo Servidor</DialogTitle>
                  <DialogDescription className="text-gray-300">
                    Dê um nome ao seu novo servidor. Você pode ter até 2 servidores.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateServer} className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nome
                    </Label>
                    <Input
                      id="name"
                      value={newServerName}
                      onChange={(e) => setNewServerName(e.target.value)}
                      placeholder="Meu Servidor Web"
                      className="col-span-3"
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={creatingServer}>
                      {creatingServer ? "Criando..." : "Criar Servidor"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">Carregando servidores...</div>
          ) : servers.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Você ainda não tem servidores. Clique em "Criar Novo Servidor" para começar!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Imagem</TableHead>
                  <TableHead>Recursos</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {servers.map((server) => (
                  <TableRow key={server._id}>
                    <TableCell className="font-medium">{server.name}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          server.status === "running"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : server.status === "stopped"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {server.status.charAt(0).toUpperCase() + server.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>{server.image}</TableCell>
                    <TableCell>{`${server.allocatedCpu} CPU, ${server.allocatedMemory}MB RAM`}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleAction(server._id, "start")}
                          disabled={server.status === "running" || server.status === "creating"}
                          aria-label="Iniciar Servidor"
                        >
                          <PlayIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleAction(server._id, "stop")}
                          disabled={server.status === "stopped" || server.status === "deleting"}
                          aria-label="Parar Servidor"
                        >
                          <StopIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleAction(server._id, "restart")}
                          disabled={server.status !== "running"}
                          aria-label="Reiniciar Servidor"
                        >
                          <RotateCcwIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleAction(server._id, "delete")}
                          disabled={server.status === "deleting" || server.status === "creating"}
                          aria-label="Deletar Servidor"
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" aria-label="Terminal">
                          <TerminalIcon className="h-4 w-4" />
                        </Button>
                        <Link href={`/servers/${server._id}/files`} passHref>
                          <Button variant="outline" size="icon" aria-label="Gerenciar Arquivos">
                            <FolderOpenIcon className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="icon" aria-label="Editar Arquivo">
                          <EditIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
))
DialogFooter.displayName = "DialogFooter"
