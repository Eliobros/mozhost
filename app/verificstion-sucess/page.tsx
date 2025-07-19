import Link from "next/link"
import { CheckCircleIcon } from "lucide-react"

export default function VerificationSuccessPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg dark:bg-gray-800" />
        <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-50">E-mail Verificado!</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Sua conta foi verificada com sucesso. Agora você pode fazer login.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-600"
          prefetch={false}
        >
          Ir para o Login
        </Link>
      </div>
    
  )
}
