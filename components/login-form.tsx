"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  // Añadir un estado de "recordarme" para mantener la sesión
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Aquí iría la lógica de autenticación real
      // Este es un ejemplo simulado
      const response = await new Promise<{ success: boolean }>((resolve) => {
        setTimeout(() => {
          // Simulación de validación básica
          if (email === "usuario@ejemplo.com" && password === "password") {
            resolve({ success: true })
          } else {
            resolve({ success: false })
          }
        }, 1000)
      })

      if (response.success) {
        router.push("/") // Redirección a la página principal
      } else {
        setError("Email o contraseña incorrectos. Por favor, inténtalo de nuevo.")
      }
    } catch (err) {
      setError("Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError("")

    try {
      // Aquí iría la lógica de autenticación con Google
      // Este es un ejemplo simulado
      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push("/") // Redirección a la página principal
    } catch (err) {
      setError("Ocurrió un error al iniciar sesión con Google. Por favor, inténtalo de nuevo.")
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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-white">
              Contraseña
            </Label>
            <Link href="/forgot-password" className="text-sm text-red-500 hover:text-red-400">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border-gray-700 bg-gray-800 text-white"
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700 text-white">
          {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gray-900 px-2 text-gray-400">O continúa con</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full border-gray-700 bg-transparent text-white hover:bg-gray-800"
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
          <path d="M1 1h22v22H1z" fill="none" />
        </svg>
        Iniciar sesión con Google
      </Button>

      <div className="text-center text-sm text-gray-400">
        ¿No tienes una cuenta?{" "}
        <Link href="/register" className="text-red-500 hover:text-red-400">
          Regístrate ahora
        </Link>
      </div>

      <div className="flex items-center space-x-2 my-4">
        <input
          type="checkbox"
          id="remember"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-red-600"
        />
        <Label htmlFor="remember" className="text-sm text-gray-400">
          Recordarme
        </Label>
      </div>

    </div>
  )
}



