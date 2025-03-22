import RegisterForm from "@/components/register-form"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Registro | CULT&UNDERGROUND",
  description: "Regístrate para unirte a la comunidad de CULT&UNDERGROUND",
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block mb-6 text-red-500 hover:text-red-400 transition-colors">
            ← Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold text-white">Crear Cuenta</h1>
          <p className="mt-2 text-gray-400">Únete a nuestra comunidad de cine de culto</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}

