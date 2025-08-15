import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ANAMOLA - Partido Político",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  keywords: ["ANAMOLA", "Partido Político", "Moçambique", "Democracia", "Desenvolvimento"],
  authors: [
    { name: "ANAMOLA",
       url: "https://anamola.org.mz"
       }
      ],
  creator: "ANAMOLA",
  openGraph: {
    title: "ANAMOLA - Partido Político",
    description: "Partido político comprometido com o desenvolvimento de Moçambique",
    url: "https://anamola.org.mz",
    siteName: "ANAMOLA",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ANAMOLA - Partido Político",
      },
    ],
    locale: "pt-MZ",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  description: "Partido político comprometido com o desenvolvimento de Moçambique, promovendo democracia, justiça social e progresso para todos os moçambicanos.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-MZ">
      <body className={inter.className}>
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
