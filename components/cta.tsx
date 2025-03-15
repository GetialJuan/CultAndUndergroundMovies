"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Button } from "@/components/ui/button"

export function Cta() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background with film strip effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-red-900/20 to-black"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-red-500/20"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-red-500/20"></div>
      </div>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8 }}
        className="container relative z-10 px-4 md:px-6"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            Ready to Dive Into the World of Cult Cinema?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our community today and connect with thousands of passionate film enthusiasts. Discover new films,
            share your thoughts, and be part of the conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white px-8">
              Register Now
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10">
              Learn More
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

