import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = !!token;
  console.log("Is authenticated?", isAuthenticated);

  const path = request.nextUrl.pathname;

  // Rutas protegidas que requieren autenticación
  const protectedPaths = ["/profile", "/dashboard"];
  const isProtectedPath = protectedPaths.some((protectedPath) => path.startsWith(protectedPath));

  // 🔹 Bloquear acceso a rutas protegidas si no está autenticado
  if (isProtectedPath && !isAuthenticated) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", path); // Guardar la ruta original para redirigir después de login
    return NextResponse.redirect(url);
  }

  // Redirigir a login si la ruta está protegida y el usuario no está autenticado
  if (isProtectedPath && !isAuthenticated) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", path)
    return NextResponse.redirect(url)
  }

  // Redirigir a la página principal si el usuario ya está autenticado e intenta acceder a login/register
  const unprotectedPaths = ["/login", "/register", "/"]
  if(isAuthenticated && unprotectedPaths.includes(path)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/login", "/register", "/forgot-password", "/profile/:path*", "/dashboard/:path*"],
}
