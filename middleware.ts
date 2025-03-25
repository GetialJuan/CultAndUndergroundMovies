import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Usa el secret de NEXTAUTH_SECRET para verificar correctamente el token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;

  // Rutas protegidas que requieren autenticación
  const protectedPaths = ['/profile', '/dashboard'];
  const path = request.nextUrl.pathname;

  // Verificar si la ruta actual está protegida (comprobación más estricta)
  const isProtectedPath = protectedPaths.some(
    (protectedPath) =>
      path === protectedPath || path.startsWith(`${protectedPath}/`)
  );

  // Redirigir a login si la ruta está protegida y el usuario no está autenticado
  if (isProtectedPath && !isAuthenticated) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(url);
  }

  // Redirigir a la página principal si el usuario ya está autenticado e intenta acceder a login/register
  const authPaths = ['/login', '/register'];
  if (isAuthenticated && authPaths.includes(path)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Asegúrate de que el matcher incluya todas las rutas que quieres proteger
export const config = {
  matcher: [
    '/login',
    '/register',
    '/profile/:path*',
    '/dashboard',
    '/dashboard/:path*',
  ],
};
