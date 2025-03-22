import Link from "next/link"
import { Film, Twitter, Instagram, Youtube, Facebook } from "lucide-react"

export default function DashboardFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-black py-8 mt-12">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Film className="h-6 w-6 text-red-500" />
              <span className="text-xl font-bold tracking-wider">
                CULT<span className="text-red-500">&</span>UNDERGROUND
              </span>
            </Link>
            <p className="text-zinc-400 max-w-xs">
              La comunidad definitiva para los amantes del cine de culto y underground. Descubre, discute y comparte las
              películas que definen el cine alternativo.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-zinc-400 hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/films" className="text-zinc-400 hover:text-white transition-colors">
                  Películas
                </Link>
              </li>
              <li>
                <Link href="/movie-lists" className="text-zinc-400 hover:text-white transition-colors">
                  Listas
                </Link>
              </li>
              <li>
                <Link href="/discussions" className="text-zinc-400 hover:text-white transition-colors">
                  Discusiones
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-zinc-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/database" className="text-zinc-400 hover:text-white transition-colors">
                  Base de Datos
                </Link>
              </li>
              <li>
                <Link href="/directors" className="text-zinc-400 hover:text-white transition-colors">
                  Directores
                </Link>
              </li>
              <li>
                <Link href="/festivals" className="text-zinc-400 hover:text-white transition-colors">
                  Festivales
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Conecta</h3>
            <div className="flex space-x-4 mb-4">
              <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
            </div>
            <p className="text-zinc-400">
              Suscríbete a nuestro newsletter para recibir las últimas novedades sobre cine de culto.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} Cult & Underground Movies. Todos los derechos reservados.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy" className="text-zinc-400 hover:text-white text-sm transition-colors">
              Política de Privacidad
            </Link>
            <Link href="/terms" className="text-zinc-400 hover:text-white text-sm transition-colors">
              Términos de Servicio
            </Link>
            <Link href="/cookies" className="text-zinc-400 hover:text-white text-sm transition-colors">
              Política de Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

