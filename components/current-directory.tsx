"use client"

import { FolderIcon, ChevronRightIcon } from "lucide-react"

interface CurrentDirectoryProps {
  path: string
}

export function CurrentDirectory({ path }: CurrentDirectoryProps) {
  const pathParts = path.split("/").filter(Boolean)
  
  return (
    <div className="flex items-center gap-1 text-sm text-gray-400 font-mono">
      <FolderIcon className="h-4 w-4 text-blue-400" />
      <span className="text-blue-400">/</span>
      {pathParts.map((part, index) => (
        <div key={index} className="flex items-center">
          <ChevronRightIcon className="h-3 w-3 text-gray-500 mx-1" />
          <span className={index === pathParts.length - 1 ? "text-white font-semibold" : "text-gray-400"}>
            {part}
          </span>
        </div>
      ))}
    </div>
  )
}