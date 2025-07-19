"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { CoinsIcon, LogOutIcon } from "lucide-react"

export default function Navbar() {
  const [coins, setCoins] = useState<number | null>(null)
  const [loadingCoins, setLoadingCoins] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch("/api/coins/get")
        if (res.ok) {
          const data = await res.json()
          setCoins(data.coins)
        } else {
          // Handle cases where user is not logged in or token is invalid
          setCoins(0) // Or null, depending on desired behavior
          console.error("Failed to fetch coins:", await res.json())
        }
      } catch (error) {
        console.error("Error fetching coins:", error)
        setCoins(0) // Default to 0 on network error
      } finally {
        setLoadingCoins(false)
      }
    }

    fetchCoins()
  }, [])

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST" }) // Assuming you'll create a logout API
      if (res.ok) {
        toast({
          title: "Sucesso!",
          description: "Você foi desconectado.",
          variant: "default",
        })
        router.push("/login")
      } else {
        const data = await res.json()
        toast({
          title: "Erro ao desconectar",
          description: data.error || "Ocorreu um erro inesperado.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro de rede ou servidor ao desconectar:", error)
      toast({
        title: "Erro",
        description: "Não foi possível desconectar. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-gray-950">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Image
            src="/mozhost.png?height=40&width=40"
            alt="MozHost Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-xl font-bold text-gray-900 dark:text-gray-50">MozHost</span>
        </Link>
        <nav className="flex items-center gap-4">
          {loadingCoins ? (
            <span className="text-sm text-gray-500 dark:text-gray-400">Carregando coins...</span>
          ) : (
            <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
              <CoinsIcon className="h-5 w-5" />
              <span className="font-medium">{coins !== null ? coins : "N/A"} Coins</span>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Sair">
            <LogOutIcon className="h-5 w-5" />
          </Button>
        </nav>
      </div>
    </header>
  )
}
