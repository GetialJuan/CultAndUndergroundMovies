import { NextRequest, NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token no proporcionado' },
        { status: 400 }
      );
    }

    // Buscar usuario con este token
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        tokenExpiry: { gt: new Date() }, // Verificar que el token no ha expirado
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 400 }
      );
    }

    // Actualizar usuario como verificado
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        tokenExpiry: null,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Email verificado correctamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al verificar email:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
