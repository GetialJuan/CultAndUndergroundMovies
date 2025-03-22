"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation";

export function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative overflow-hidden">
      {/* Background video/image with overlay */}
      <div className="absolute inset-0 z-0">
        <video autoPlay muted loop playsInline className="object-cover w-full h-full" poster="/hero-poster.jpg">
          <source src="/hero-background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black"></div>
      </div>

      <div className="container relative z-10 px-4 py-24 md:py-32 lg:py-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Where Cult Cinema Finds Its <span className="text-red-500">Community</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">Discover. Discuss. Share Cult & Underground Films.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white px-8" onClick={() => router.push("register")}>
              Register Now
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10">
              Explore Films
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Film reel animation effect */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-8 overflow-hidden">
        <div className="flex animate-marquee">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="w-8 h-8 border-2 border-white/20 rounded-full mx-1"></div>
          ))}
        </div>
      </div>
    </section>
  )
}

