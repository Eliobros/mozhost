"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  FolderIcon,
  FileIcon,
  ArrowLeftIcon,
  SaveIcon,
  MoreHorizontalIcon,
  PlusIcon,
  DownloadIcon,
  Trash2Icon,
  EditIcon,
  TerminalIcon,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
import { ServerTerminal } from "@/components/server-terminal" // Importar o componente do terminal

interface FileEntry {
  name: string
  isDirectory: boolean
  isFile: boolean
}

interface ServerDetails {
  _id: string
  name: string
  dockerContainerId?: string
  // Adicione outras propriedades do servidor se necessário
}

export default function ServerFilesPage() {
  const params = useParams()
  const serverId = params.id as string
  const router = useRouter()
  const { toast } = useToast()

  const [currentPath, setCurrentPath] = useState<string>("")
  const [files, setFiles] = useState<FileEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFileContent, setSelectedFileContent] = useState<string | undefined>(undefined)
  const [selectedFileName, setSelectedFileName] = useState<string | undefined>(undefined)
  const [saving, setSaving] = useState(false)
  const [serverDetails, setServerDetails] = useState<ServerDetails | null>(null) // Estado para detalhes do servidor

  // Dialog states
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [isRenaming, setIsRenaming] = useState(false)
  const [oldNameForRename, setOldNameForRename] = useState("")
  const [newNameForRename, setNewNameForRename] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<FileEntry | null>(null)
  const [isTerminalDialogOpen, setIsTerminalDialogOpen] = useState(false) // Estado para o dialog do terminal

  // Função para buscar detalhes do servidor (incluindo dockerContainerId)
  const fetchServerDetails = useCallback(async () => {
    try {
      const res = await fetch(`/api/servers/list`) // Reutiliza a API de listagem, mas filtra pelo ID
      if (res.ok) {
        const data = await res.json()
        const foundServer = data.servers.find((s: ServerDetails) => s._id === serverId)
        if (foundServer) {
          setServerDetails(foundServer)
        } else {
          toast({
            title: "Erro",
            description: "Servidor não encontrado.",
            variant: "destructive",
          })
          router.push("/servers") // Redireciona se o servidor não for encontrado
        }
      } else {
        const errorData = await res.json()
        toast({
          title: "Erro ao carregar detalhes do servidor",
          description: errorData.error || "Não foi possível carregar os detalhes do servidor.",
          variant: "destructive",
        })
        if (res.status === 401) {
          router.push("/login")
        }
      }
    } catch (error) {
      console.error("Erro de rede ao carregar detalhes do servidor:", error)
      toast({
        title: "Erro",
        description: "Não foi possível conectar ao servidor para carregar detalhes.",
        variant: "destructive",
      })
    }
  }, [serverId, router, toast])

  const fetchFiles = useCallback(
    async (path: string) => {
      setLoading(true)
      setSelectedFileContent(undefined) // Fechar editor ao navegar
      setSelectedFileName(undefined)
      try {
        const res = await fetch(`/api/servers/${serverId}/files?path=${encodeURIComponent(path)}`)
        if (res.ok) {
          const data = await res.json()
          if (data.isDirectory) {
            setFiles(data.files)
            setCurrentPath(path)
          } else if (data.isFile) {
            // Se for um arquivo, abre o editor
            setSelectedFileContent(data.content)
            setSelectedFileName(data.name)
            setFiles([]) // Limpa a lista de arquivos para mostrar o editor
          }
        } else {
          const errorData = await res.json()
          toast({
            title: "Erro ao carregar arquivos",
            description: errorData.error || "Não foi possível carregar os arquivos do servidor.",
            variant: "destructive",
          })
          if (res.status === 401) {
            router.push("/login")
          }
        }
      } catch (error) {
        console.error("Erro de rede ao carregar arquivos:", error)
        toast({
          title: "Erro",
          description: "Não foi possível conectar ao servidor para carregar arquivos.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    },
    [serverId, router, toast],
  )

  useEffect(() => {
    if (serverId) {
      fetchServerDetails() // Busca os detalhes do servidor ao carregar a página
      fetchFiles("") // Carrega o diretório raiz ao montar
    }
  }, [serverId, fetchFiles, fetchServerDetails])

  const handleFileClick = (file: FileEntry) => {
    const newPath = currentPath ? `${currentPath}/${file.name}` : file.name
    if (file.isDirectory) {
      fetchFiles(newPath)
    } else {
      // Se for um arquivo, abre para edição
      fetchFiles(newPath)
    }
  }

  const handleGoBack = () => {
    if (selectedFileName) {
      // Se estiver editando um arquivo, volta para a lista de arquivos da pasta atual
      setSelectedFileContent(undefined)
      setSelectedFileName(undefined)
      fetchFiles(currentPath)
    } else {
      // Se estiver navegando em pastas, sobe um nível
      const pathParts = currentPath.split("/")
      if (pathParts.length > 1) {
        const newPath = pathParts.slice(0, -1).join("/")
        fetchFiles(newPath)
      } else {
        fetchFiles("") // Volta para a raiz
      }
    }
  }

  const handleSaveFile = async () => {
    if (!selectedFileName || selectedFileContent === undefined) return

    setSaving(true)
    try {
      const fullFilePath = currentPath ? `${currentPath}/${selectedFileName}` : selectedFileName
      const res = await fetch(`/api/servers/${serverId}/files/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filePath: fullFilePath, content: selectedFileContent }),
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: "Sucesso!",
          description: data.message,
          variant: "default",
        })
      } else {
        toast({
          title: "Erro ao salvar arquivo",
          description: data.error || "Ocorreu um erro inesperado.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro de rede ao salvar arquivo:", error)
      toast({
        title: "Erro",
        description: "Não foi possível conectar ao servidor para salvar o arquivo.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFolderName.trim()) {
      toast({ title: "Erro", description: "O nome da pasta não pode ser vazio.", variant: "destructive" })
      return
    }

    const fullNewPath = currentPath ? `${currentPath}/${newFolderName}` : newFolderName

    try {
      const res = await fetch(`/api/servers/${serverId}/files/create-directory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: fullNewPath }),
      })

      const data = await res.json()
      if (res.ok) {
        toast({ title: "Sucesso!", description: data.message, variant: "default" })
        setIsCreateFolderDialogOpen(false)
        setNewFolderName("")
        fetchFiles(currentPath) // Recarregar a lista
      } else {
        toast({ title: "Erro", description: data.error || "Falha ao criar pasta.", variant: "destructive" })
      }
    } catch (error) {
      console.error("Erro ao criar pasta:", error)
      toast({ title: "Erro", description: "Erro de rede ao criar pasta.", variant: "destructive" })
    }
  }

  const handleCreateFile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFolderName.trim()) {
      // Reusing newFolderName state for new file name
      toast({ title: "Erro", description: "O nome do arquivo não pode ser vazio.", variant: "destructive" })
      return
    }

    const fullNewPath = currentPath ? `${currentPath}/${newFolderName}` : newFolderName

    try {
      const res = await fetch(`/api/servers/${serverId}/files/create-file`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: fullNewPath }),
      })

      const data = await res.json()
      if (res.ok) {
        toast({ title: "Sucesso!", description: data.message, variant: "default" })
        setIsCreateFolderDialogOpen(false) // Close the same dialog used for folder
        setNewFolderName("")
        fetchFiles(fullNewPath) // Open the newly created file for editing
      } else {
        toast({ title: "Erro", description: data.error || "Falha ao criar arquivo.", variant: "destructive" })
      }
    } catch (error) {
      console.error("Erro ao criar arquivo:", error)
      toast({ title: "Erro", description: "Erro de rede ao criar arquivo.", variant: "destructive" })
    }
  }

  const handleDeleteItem = async () => {
    if (!itemToDelete) return

    const fullPathToDelete = currentPath ? `${currentPath}/${itemToDelete.name}` : itemToDelete.name

    try {
      const res = await fetch(`/api/servers/${serverId}/files/delete?path=${encodeURIComponent(fullPathToDelete)}`, {
        method: "DELETE",
      })

      const data = await res.json()
      if (res.ok) {
        toast({ title: "Sucesso!", description: data.message, variant: "default" })
        setIsDeleteDialogOpen(false)
        setItemToDelete(null)
        fetchFiles(currentPath) // Recarregar a lista
      } else {
        toast({ title: "Erro", description: data.error || "Falha ao deletar.", variant: "destructive" })
      }
    } catch (error) {
      console.error("Erro ao deletar:", error)
      toast({ title: "Erro", description: "Erro de rede ao deletar.", variant: "destructive" })
    }
  }

  const handleRenameItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!oldNameForRename || !newNameForRename.trim()) {
      toast({ title: "Erro", description: "Nomes não podem ser vazios.", variant: "destructive" })
      return
    }

    const fullOldPath = currentPath ? `${currentPath}/${oldNameForRename}` : oldNameForRename
    const fullNewPath = currentPath ? `${currentPath}/${newNameForRename}` : newNameForRename

    try {
      const res = await fetch(`/api/servers/${serverId}/files/rename`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPath: fullOldPath, newPath: fullNewPath }),
      })

      const data = await res.json()
      if (res.ok) {
        toast({ title: "Sucesso!", description: data.message, variant: "default" })
        setIsRenaming(false)
        setOldNameForRename("")
        setNewNameForRename("")
        fetchFiles(currentPath) // Recarregar a lista
      } else {
        toast({ title: "Erro", description: data.error || "Falha ao renomear.", variant: "destructive" })
      }
    } catch (error) {
      console.error("Erro ao renomear:", error)
      toast({ title: "Erro", description: "Erro de rede ao renomear.", variant: "destructive" })
    }
  }

  const handleDownloadFile = async (fileName: string) => {
    const fullFilePath = currentPath ? `${currentPath}/${fileName}` : fileName
    try {
      const res = await fetch(`/api/servers/${serverId}/files/download?path=${encodeURIComponent(fullFilePath)}`)

      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = fileName // Usa o nome original do arquivo
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
        toast({ title: "Sucesso!", description: "Download iniciado.", variant: "default" })
      } else {
        const errorData = await res.json()
        toast({ title: "Erro", description: errorData.error || "Falha ao baixar arquivo.", variant: "destructive" })
      }
    } catch (error) {
      console.error("Erro ao baixar arquivo:", error)
      toast({ title: "Erro", description: "Erro de rede ao baixar arquivo.", variant: "destructive" })
    }
  }

  return (
    <div className="flex min-h-[calc(100dvh-64px)] flex-col items-center bg-gray-100 px-4 py-8 dark:bg-gray-950">
      <Card className="w-full max-w-4xl bg-white shadow-lg dark:bg-gray-900 dark:text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Gerenciador de Arquivos</CardTitle>
          <div className="flex items-center gap-2">
            {(currentPath !== "" || selectedFileName) && (
              <Button variant="outline" size="sm" onClick={handleGoBack}>
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            )}
            {selectedFileName ? (
              <Button onClick={handleSaveFile} disabled={saving}>
                <SaveIcon className="mr-2 h-4 w-4" />
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            ) : (
              <>
                <Dialog open={isCreateFolderDialogOpen} onOpenChange={setIsCreateFolderDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Criar Novo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white">
                    <DialogHeader>
                      <DialogTitle>Criar Novo Item</DialogTitle>
                      <DialogDescription className="text-gray-300">
                        Escolha se deseja criar uma nova pasta ou um novo arquivo.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="newItemName">Nome</Label>
                        <Input
                          id="newItemName"
                          value={newFolderName} // Reusing state for simplicity
                          onChange={(e) => setNewFolderName(e.target.value)}
                          placeholder="nome-do-item"
                          required
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button onClick={handleCreateFolder}>Criar Pasta</Button>
                        <Button onClick={handleCreateFile}>Criar Arquivo</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog open={isTerminalDialogOpen} onOpenChange={setIsTerminalDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <TerminalIcon className="mr-2 h-4 w-4" />
                      Terminal
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-3xl bg-gray-900 text-white p-0 border-none">
                    {serverDetails?.dockerContainerId ? (
                      <ServerTerminal serverId={serverId} dockerContainerId={serverDetails.dockerContainerId} />
                    ) : (
                      <div className="p-6 text-center text-gray-400">
                        Carregando detalhes do servidor para o terminal...
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">Carregando arquivos...</div>
          ) : selectedFileName ? (
            // Editor de arquivo
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Editando: {selectedFileName}</h3>
              <Textarea
                value={selectedFileContent}
                onChange={(e) => setSelectedFileContent(e.target.value)}
                className="min-h-[400px] font-mono text-sm bg-gray-800 text-gray-50 border-gray-700 focus-visible:ring-blue-500"
                spellCheck="false"
              />
            </div>
          ) : files.length === 0 && currentPath === "" ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">Nenhum arquivo encontrado.</div>
          ) : (
            // Lista de arquivos/pastas
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.name}>
                    <TableCell className="font-medium flex items-center gap-2">
                      {file.isDirectory ? (
                        <FolderIcon className="h-5 w-5 text-blue-500" />
                      ) : (
                        <FileIcon className="h-5 w-5 text-gray-500" />
                      )}
                      <span onClick={() => handleFileClick(file)} className="cursor-pointer hover:underline">
                        {file.name}
                      </span>
                    </TableCell>
                    <TableCell>{file.isDirectory ? "Diretório" : "Arquivo"}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontalIcon className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuItem onClick={() => handleFileClick(file)}>
                            {file.isDirectory ? (
                              <>
                                <FolderIcon className="mr-2 h-4 w-4" /> Abrir
                              </>
                            ) : (
                              <>
                                <EditIcon className="mr-2 h-4 w-4" /> Editar
                              </>
                            )}
                          </DropdownMenuItem>
                          {!file.isDirectory && (
                            <DropdownMenuItem onClick={() => handleDownloadFile(file.name)}>
                              <DownloadIcon className="mr-2 h-4 w-4" /> Baixar
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => {
                              setOldNameForRename(file.name)
                              setNewNameForRename(file.name)
                              setIsRenaming(true)
                            }}
                          >
                            <EditIcon className="mr-2 h-4 w-4" /> Renomear
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setItemToDelete(file)
                              setIsDeleteDialogOpen(true)
                            }}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2Icon className="mr-2 h-4 w-4" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog para Renomear */}
      <Dialog open={isRenaming} onOpenChange={setIsRenaming}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white">
          <DialogHeader>
            <DialogTitle>Renomear {oldNameForRename}</DialogTitle>
            <DialogDescription className="text-gray-300">
              Digite o novo nome para "{oldNameForRename}".
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRenameItem} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newName" className="text-right">
                Novo Nome
              </Label>
              <Input
                id="newName"
                value={newNameForRename}
                onChange={(e) => setNewNameForRename(e.target.value)}
                placeholder="novo-nome"
                className="col-span-3"
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Renomear</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* AlertDialog para Excluir */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-900 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Esta ação não pode ser desfeita. Isso excluirá permanentemente{" "}
              <span className="font-bold text-red-400">{itemToDelete?.name}</span> e todo o seu conteúdo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
