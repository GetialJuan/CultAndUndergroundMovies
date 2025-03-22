"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Eye, EyeOff } from "lucide-react"

import { signIn } from "next-auth/react"

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [generalError, setGeneralError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpiar errores al editar
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido"
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Por favor, ingresa un email válido"
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres"
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "La contraseña debe incluir al menos una letra mayúscula"
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "La contraseña debe incluir al menos un número"
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      newErrors.password = "La contraseña debe incluir al menos un carácter especial"
    }

    // Validar confirmación de contraseña
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setGeneralError("")

    try {
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al registrarse")
      }

      // Registro exitoso, iniciar sesión automáticamente
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (result?.error) {
        throw new Error(result.error || "Error al iniciar sesión automáticamente")
      }

      // Redireccionar al inicio
      router.push("/")
      router.refresh()
    } catch (err: any) {
      setGeneralError(err.message || "Ocurrió un error al registrar tu cuenta. Por favor, inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    setIsLoading(true)
    setGeneralError("")

    try {
      await signIn("google", { callbackUrl: "/" })
      // No necesitamos manejar la redirección aquí, ya que NextAuth lo hace automáticamente
    } catch (err: any) {
      setGeneralError(err.message || "Ocurrió un error al registrarse con Google. Por favor, inténtalo de nuevo.")
      setIsLoading(false) // Solo necesitamos esto si hay un error, de lo contrario NextAuth maneja la redirección
    }
  }

  return (
    <div className="space-y-6 rounded-lg border border-gray-800 bg-gray-900/50 p-6 shadow-lg">
      {generalError && (
        <Alert variant="destructive" className="border-red-800 bg-red-950 text-red-400">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{generalError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">
            Nombre completo
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Tu nombre"
            className={`border-gray-700 bg-gray-800 text-white ${errors.name ? "border-red-600" : ""}`}
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            className={`border-gray-700 bg-gray-800 text-white ${errors.email ? "border-red-600" : ""}`}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-white">
            Contraseña
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className={`border-gray-700 bg-gray-800 text-white pr-10 ${errors.password ? "border-red-600" : ""}`}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password ? (
            <p className="text-xs text-red-500">{errors.password}</p>
          ) : (
            <p className="text-xs text-gray-500">
              La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, un número y un carácter
              especial.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-white">
            Confirmar contraseña
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`border-gray-700 bg-gray-800 text-white pr-10 ${
                errors.confirmPassword ? "border-red-600" : ""
              }`}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
        </div>

        <Button type="submit" disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700 text-white">
          {isLoading ? "Registrando..." : "Registrarse"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gray-900 px-2 text-gray-400">O regístrate con</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleRegister}
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
        Registrarse con Google
      </Button>

      <div className="text-center text-sm text-gray-400">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/login" className="text-red-500 hover:text-red-400">
          Inicia sesión
        </Link>
      </div>
    </div>
  )
}

