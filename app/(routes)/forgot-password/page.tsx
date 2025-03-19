import type { Metadata } from "next"
import ForgotPasswordForm from "@/components/forgot-password-form"

export const metadata: Metadata = {
  title: "Recuperar Contraseña | CULT&UNDERGROUND",
  description: "Recupera tu contraseña para acceder a tu cuenta en CULT&UNDERGROUND",
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Recuperar Contraseña</h1>
          <p className="mt-2 text-gray-400">Ingresa tu email para recibir un enlace de recuperación</p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  )
}

