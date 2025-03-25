/**
 * @fileoverview Navbar component for the application's navigation bar.
 * This component renders a responsive navigation bar with links to different sections
 * of the application. It includes a logo, navigation links, and login/register buttons.
 * It also handles mobile menu toggling.
 *
 * @component
 * @example
 * <Navbar />
 */

"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Film } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"; 

/**
 * Navbar component.
 *
 * @returns {JSX.Element} The rendered Navbar component.
 */
export function Navbar() {
  const router = useRouter();
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 backdrop-blur-md bg-black/80">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Film className="h-6 w-6 text-red-500" />
          <span className="text-xl font-bold tracking-wider">
            CULT<span className="text-red-500">&</span>UNDERGROUND
          </span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="#features" className="text-sm font-medium hover:text-red-400 transition-colors">
            Features
          </Link>
          <Link href="#films" className="text-sm font-medium hover:text-red-400 transition-colors">
            Films
          </Link>
          <Link href="#community" className="text-sm font-medium hover:text-red-400 transition-colors">
            Community
          </Link>
          <Link href="#about" className="text-sm font-medium hover:text-red-400 transition-colors">
            About
          </Link>
        </nav>
        <div className="hidden md:flex gap-4">
          <Button variant="outline" className="border-red-500 text-white hover:bg-red-500/20" onClick={() => router.push("login")}>
            Log in
          </Button>
          <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={() => router.push("register")}>
            Register Now
          </Button>
        </div>
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-black/95 backdrop-blur-sm md:hidden">
          <nav className="flex flex-col items-center justify-center h-full gap-8 p-4">
            <Link
              href="#features"
              className="text-xl font-medium hover:text-red-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#explore"
              className="text-xl font-medium hover:text-red-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Films
            </Link>
            <Link
              href="#community"
              className="text-xl font-medium hover:text-red-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Community
            </Link>
            <Link
              href="#about"
              className="text-xl font-medium hover:text-red-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <div className="flex flex-col w-full gap-4 mt-8">
              <Button variant="outline" className="border-red-500 text-white hover:bg-red-500/20 w-full">
                Log in
              </Button>
              <Button className="bg-red-500 hover:bg-red-600 text-white w-full">Register Now</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}