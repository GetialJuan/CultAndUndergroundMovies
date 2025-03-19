import type { Metadata } from "next"
import VerifyEmailComponent from "@/components/verify-email"

export const metadata: Metadata = {
  title: "Verificar Email | CULT&UNDERGROUND",
  description: "Verifica tu email para completar tu registro en CULT&UNDERGROUND",
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Verificar Email</h1>
          <p className="mt-2 text-gray-400">Estamos verificando tu dirección de correo electrónico</p>
        </div>
        <VerifyEmailComponent />
      </div>
    </div>
  )
}

