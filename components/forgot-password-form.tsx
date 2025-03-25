"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    try {
      // Aquí iría la lógica real para enviar el correo de recuperación
      // Este es un ejemplo simulado
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess(true)
    } catch (err) {
      setError("Ocurrió un error al enviar el correo. Por favor, inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 rounded-lg border border-gray-800 bg-gray-900/50 p-6 shadow-lg">
      {error && (
        <Alert variant="destructive" className="border-red-800 bg-red-950 text-red-400">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success ? (
        <div className="space-y-4">
          <Alert className="border-green-800 bg-green-950 text-green-400">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>Hemos enviado un correo con instrucciones para recuperar tu contraseña.</AlertDescription>
          </Alert>
          <div className="text-center">
            <Link href="/login" className="text-red-500 hover:text-red-400">
              Volver a iniciar sesión
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="border-gray-700 bg-gray-800 text-white"
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700 text-white">
            {isLoading ? "Enviando..." : "Enviar instrucciones"}
          </Button>

          <div className="text-center text-sm">
            <Link href="/login" className="text-red-500 hover:text-red-400">
              Volver a iniciar sesión
            </Link>
          </div>
        </form>
      )}
    </div>
  )
}

