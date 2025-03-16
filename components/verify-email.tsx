"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

export default function VerifyEmailComponent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error")
        setErrorMessage("Token de verificación no encontrado. Por favor, solicita un nuevo enlace de verificación.")
        return
      }

      try {
        // Aquí iría la lógica real de verificación del token
        // Este es un ejemplo simulado
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Simulamos una verificación exitosa
        setStatus("success")

        // Redirección automática después de 3 segundos
        setTimeout(() => {
          router.push("/")
        }, 3000)
      } catch (err) {
        setStatus("error")
        setErrorMessage("No pudimos verificar tu email. El enlace puede haber expirado o ser inválido.")
      }
    }

    verifyEmail()
  }, [token, router])

  const handleGoToHome = () => {
    router.push("/")
  }

  const handleGoToLogin = () => {
    router.push("/login")
  }

  return (
    <div className="space-y-6 rounded-lg border border-gray-800 bg-gray-900/50 p-6 shadow-lg">
      {status === "loading" && (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <Loader2 className="h-12 w-12 animate-spin text-red-500" />
          <p className="text-gray-400">Verificando tu dirección de email...</p>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-6">
          <Alert className="border-green-800 bg-green-950 text-green-400">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>¡Tu email ha sido verificado exitosamente!</AlertDescription>
          </Alert>

          <div className="space-y-4 text-center">
            <p className="text-gray-400">Serás redirigido automáticamente a la página principal en unos segundos.</p>

            <Button onClick={handleGoToHome} className="w-full bg-red-600 hover:bg-red-700 text-white">
              Ir a la página principal
            </Button>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-6">
          <Alert variant="destructive" className="border-red-800 bg-red-950 text-red-400">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>

          <div className="space-y-4 text-center">
            <p className="text-gray-400">
              Por favor, intenta registrarte nuevamente o contacta a soporte si el problema persiste.
            </p>

            <Button onClick={handleGoToLogin} className="w-full bg-red-600 hover:bg-red-700 text-white">
              Volver a iniciar sesión
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

