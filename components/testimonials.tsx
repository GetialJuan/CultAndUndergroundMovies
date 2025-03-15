"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    id: 1,
    name: "Alex Rodriguez",
    role: "Film Student",
    quote:
      "This community has introduced me to so many incredible films I would have never discovered otherwise. The discussions are insightful and the recommendations are spot on.",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Independent Filmmaker",
    quote:
      "As a filmmaker, I've found incredible inspiration and support here. The platform has even helped me connect with collaborators for my latest project.",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Marcus Johnson",
    role: "Cinema Enthusiast",
    quote:
      "I've been a cult film fan for decades, and this is the first online community that really gets it. The curation is excellent and the community is passionate without being pretentious.",
    avatar: "/placeholder.svg?height=100&width=100",
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section id="community" className="py-16 bg-black">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">What Our Community Says</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join thousands of cult cinema enthusiasts who have found their film home.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-900/30 border border-gray-800 rounded-lg p-8 md:p-12"
            >
              <Quote className="h-12 w-12 text-red-500/40 mb-6" />
              <blockquote className="text-xl md:text-2xl italic mb-8">"{testimonials[currentIndex].quote}"</blockquote>
              <div className="flex items-center">
                <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src={testimonials[currentIndex].avatar || "/placeholder.svg"}
                    alt={testimonials[currentIndex].name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold">{testimonials[currentIndex].name}</p>
                  <p className="text-gray-400 text-sm">{testimonials[currentIndex].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center mt-8 gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="rounded-full border-white/20 hover:bg-white/10"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous testimonial</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="rounded-full border-white/20 hover:bg-white/10"
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next testimonial</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

