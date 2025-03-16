import LoginForm from "@/components/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Iniciar Sesión | CULT&UNDERGROUND",
  description: "Inicia sesión para acceder a tu cuenta en CULT&UNDERGROUND",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Iniciar Sesión</h1>
          <p className="mt-2 text-gray-400">
            Accede a tu cuenta para descubrir, discutir y compartir películas de culto
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

