import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { FilmGallery } from "@/components/film-gallery"
import { Features } from "@/components/features"
import { Testimonials } from "@/components/testimonials"
import { Cta } from "@/components/cta"
import { Footer } from "@/components/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-[url('/film-grain.png')] opacity-10 mix-blend-overlay pointer-events-none z-10"></div>
      <Navbar />
      <main>
        <Hero />
        <FilmGallery />
        <Features />
        <Testimonials />
        <Cta />
      </main>
      <Footer />
    </div>
  )
}

