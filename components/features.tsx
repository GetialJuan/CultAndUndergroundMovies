"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { ListChecks, MessageSquare, Star, Film, Users, BookMarked } from "lucide-react"

const features = [
  {
    icon: <ListChecks className="h-10 w-10 text-red-500" />,
    title: "Personalized Movie Lists",
    description: "Create and share your own curated lists of underground classics and hidden gems.",
  },
  {
    icon: <MessageSquare className="h-10 w-10 text-red-500" />,
    title: "Community Discussions",
    description: "Engage in deep conversations about cult cinema with fellow enthusiasts.",
  },
  {
    icon: <Star className="h-10 w-10 text-red-500" />,
    title: "Rare Film Reviews",
    description: "Access thoughtful critiques of obscure and hard-to-find films from our community.",
  },
  {
    icon: <Film className="h-10 w-10 text-red-500" />,
    title: "Film Discovery",
    description: "Discover new underground films based on your taste and viewing history.",
  },
  {
    icon: <Users className="h-10 w-10 text-red-500" />,
    title: "Connect with Cinephiles",
    description: "Find and follow other members who share your unique film interests.",
  },
  {
    icon: <BookMarked className="h-10 w-10 text-red-500" />,
    title: "Watchlist Tracking",
    description: "Keep track of films you want to watch and get notified of rare screenings.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-16 bg-gradient-to-b from-black to-gray-900">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Why Join Our Community?</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover the unique features that make Cult & Underground Movies the premier destination for alternative
            cinema lovers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ feature, index }: { feature: (typeof features)[0]; index: number }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:bg-gray-800/50 transition-colors"
    >
      <div className="mb-4">{feature.icon}</div>
      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
      <p className="text-gray-400">{feature.description}</p>
    </motion.div>
  )
}

