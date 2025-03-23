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

  // 🔹 Bloquear acceso a /login, /register y /forgot-password si ya está autenticado
  if (isAuthenticated && ["/login", "/register", "/forgot-password"].includes(path)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/forgot-password", "/profile/:path*", "/dashboard/:path*"],
};



