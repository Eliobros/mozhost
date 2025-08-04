"use client"

import { useEffect } from "react"

interface TerminalShortcutsProps {
  onClear: () => void
  onFocus: () => void
}

export function TerminalShortcuts({ onClear, onFocus }: TerminalShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+L para limpar terminal
      if (e.ctrlKey && e.key === "l") {
        e.preventDefault()
        onClear()
      }
      
      // Ctrl+K para focar no input
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault()
        onFocus()
      }
      
      // Escape para limpar input
      if (e.key === "Escape") {
        onFocus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClear, onFocus])

  return null // Este componente não renderiza nada visualmente
}