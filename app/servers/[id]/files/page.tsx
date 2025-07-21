"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input" // Importar Input
import { Label } from "@/components/ui/label" // Importar Label
import { useToast } from "@/hooks/use-toast"
import {
  FolderIcon,
  FileIcon,
  ArrowLeftIcon,
  SaveIcon,
  PlusIcon,
  UploadIcon,
  MoreHorizontalIcon,
  Trash2Icon,
  EditIcon,
  DownloadIcon,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter, // Importar DialogFooter
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface FileEntry {
  name: string
  isDirectory: boolean
  isFile: boolean
}

interface FileContent {
  name: string
  isFile: boolean
  isDirectory: boolean
  content?: string
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

  // State para modais de ação
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [isRenaming, setIsRenaming] = useState(false)
  const [renameOldName, setRenameOldName] = useState("")
  const [renameNewName, setRenameNewName] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [fileToDelete, setFileToDelete] = useState<FileEntry | null>(null)

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
      fetchFiles("") // Carrega o diretório raiz ao montar
    }
  }, [serverId, fetchFiles])

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
      toast({
        title: "Erro",
        description: "O nome da pasta não pode estar vazio.",
        variant: "destructive",
      })
      return
    }

    setSaving(true) // Reutilizando o state de saving para operações de arquivo
    try {
      const fullPath = currentPath ? `${currentPath}/${newFolderName}` : newFolderName
      const res = await fetch(`/api/servers/${serverId}/files/create-directory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path: fullPath }),
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: "Sucesso!",
          description: data.message,
          variant: "default",
        })
        setNewFolderName("")
        setIsCreateFolderDialogOpen(false)
        fetchFiles(currentPath) // Recarregar a lista de arquivos
      } else {
        toast({
          title: "Erro ao criar pasta",
          description: data.error || "Ocorreu um erro inesperado.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro de rede ao criar pasta:", error)
      toast({
        title: "Erro",
        description: "Não foi possível conectar ao servidor para criar a pasta.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteFile = async () => {
    if (!fileToDelete) return

    setSaving(true)
    try {
      const fullPath = currentPath ? `${currentPath}/${fileToDelete.name}` : fileToDelete.name
      const res = await fetch(`/api/servers/${serverId}/files/delete?path=${encodeURIComponent(fullPath)}`, {
        method: "DELETE",
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
        setIsDeleteDialogOpen(false)
        setFileToDelete(null)
        fetchFiles(currentPath) // Recarregar a lista de arquivos
      } else {
        toast({
          title: "Erro ao deletar",
          description: data.error || "Ocorreu um erro inesperado.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro de rede ao deletar:", error)
      toast({
        title: "Erro",
        description: "Não foi possível conectar ao servidor para deletar.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleRenameFile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!renameNewName.trim()) {
      toast({
        title: "Erro",
        description: "O novo nome não pode estar vazio.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const fullOldPath = currentPath ? `${currentPath}/${renameOldName}` : renameOldName
      const fullNewPath = currentPath ? `${currentPath}/${renameNewName}` : renameNewName
      const res = await fetch(`/api/servers/${serverId}/files/rename`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oldPath: fullOldPath, newPath: fullNewPath }),
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: "Sucesso!",
          description: data.message,
          variant: "default",
        })
        setIsRenaming(false)
        setRenameOldName("")
        setRenameNewName("")
        fetchFiles(currentPath) // Recarregar a lista de arquivos
      } else {
        toast({
          title: "Erro ao renomear",
          description: data.error || "Ocorreu um erro inesperado.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro de rede ao renomear:", error)
      toast({
        title: "Erro",
        description: "Não foi possível conectar ao servidor para renomear.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDownloadFile = (file: FileEntry) => {
    if (file.isDirectory) {
      toast({
        title: "Erro",
        description: "Não é possível baixar diretórios diretamente.",
        variant: "destructive",
      })
      return
    }
    const fullPath = currentPath ? `${currentPath}/${file.name}` : file.name
    const downloadUrl = `/api/servers/${serverId}/files/download?path=${encodeURIComponent(fullPath)}`
    window.open(downloadUrl, "_blank")
    toast({
      title: "Download Iniciado",
      description: `Baixando ${file.name}...`,
      variant: "default",
    })
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
                    <Button variant="outline" size="sm">
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Nova Pasta
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white">
                    <DialogHeader>
                      <DialogTitle>Criar Nova Pasta</DialogTitle>
                      <DialogDescription className="text-gray-300">Digite o nome da nova pasta.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateFolder} className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="folderName" className="text-right">
                          Nome
                        </Label>
                        <Input
                          id="folderName"
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                          placeholder="minha-nova-pasta"
                          className="col-span-3"
                          required
                        />
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={saving}>
                          {saving ? "Criando..." : "Criar Pasta"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
                {/* Botão de Upload - Implementação futura */}
                <Button variant="outline" size="sm" disabled>
                  <UploadIcon className="mr-2 h-4 w-4" />
                  Upload
                </Button>
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
                        <DropdownMenuContent align="end">
                          {file.isFile && (
                            <DropdownMenuItem onClick={() => handleFileClick(file)}>
                              <EditIcon className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => {
                              setRenameOldName(file.name)
                              setRenameNewName(file.name)
                              setIsRenaming(true)
                            }}
                          >
                            <EditIcon className="mr-2 h-4 w-4" />
                            Renomear
                          </DropdownMenuItem>
                          {file.isFile && (
                            <DropdownMenuItem onClick={() => handleDownloadFile(file)}>
                              <DownloadIcon className="mr-2 h-4 w-4" />
                              Baixar
                            </DropdownMenuItem>
                          )}
                          <AlertDialog
                            open={isDeleteDialogOpen && fileToDelete?.name === file.name}
                            onOpenChange={setIsDeleteDialogOpen}
                          >
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()} // Prevent dropdown from closing immediately
                                onClick={() => {
                                  setFileToDelete(file)
                                  setIsDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2Icon className="mr-2 h-4 w-4 text-red-500" />
                                <span className="text-red-500">Excluir</span>
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-gray-900 text-white">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-300">
                                  Esta ação não pode ser desfeita. Isso excluirá permanentemente{" "}
                                  <span className="font-bold text-red-400">{file.name}</span> e todo o seu conteúdo.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-white">
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDeleteFile}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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

      {/* Modal de Renomear */}
      <Dialog open={isRenaming} onOpenChange={setIsRenaming}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white">
          <DialogHeader>
            <DialogTitle>Renomear {renameOldName}</DialogTitle>
            <DialogDescription className="text-gray-300">Digite o novo nome para o arquivo/pasta.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRenameFile} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newName" className="text-right">
                Novo Nome
              </Label>
              <Input
                id="newName"
                value={renameNewName}
                onChange={(e) => setRenameNewName(e.target.value)}
                placeholder="novo-nome.txt"
                className="col-span-3"
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={saving}>
                {saving ? "Renomeando..." : "Renomear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
