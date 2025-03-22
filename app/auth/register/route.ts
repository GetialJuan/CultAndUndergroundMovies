import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Validaciones básicas
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Formato de email inválido" }, { status: 400 })
    }

    // Validar contraseña
    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      return NextResponse.json(
        {
          error:
            "La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, un número y un carácter especial",
        },
        { status: 400 },
      )
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Este email ya está registrado" }, { status: 400 })
    }

    // Generar nombre de usuario único basado en el email
    const username = email.split("@")[0] + Math.floor(Math.random() * 1000).toString()

    // Generar hash de la contraseña
    const hashedPassword = await hashPassword(password)

    // Crear usuario en la base de datos
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash: hashedPassword,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: "Usuario registrado correctamente.",
        userId: newUser.id,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error al registrar usuario:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

