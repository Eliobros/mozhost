import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MozHost",
  icons: {
    icon: "/mozhost.png",
    apple: "/mozhost.png",
    shortcut: "/mozhost.png",
  },
  keywords: ["Next.js", "Mongoose", "MongoDB", "React", "TypeScript"],
  authors: [
    { name: "MozHost Team",
       url: "https://mozhost.com"
       }
      ],
  creator: "MozHost",
  openGraph: {
    title: "MozHost",
    description: "Hospedagem de sites e aplicações com Next.js e MongoDB",
    url: "https://mozhost.com",
    siteName: "MozHost",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MozHost - Hospedagem de Bots e APIs",
      },
    ],
    locale: "pt-BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  description: "Hospedagem de sites e aplicações com Next.js e MongoDB",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
