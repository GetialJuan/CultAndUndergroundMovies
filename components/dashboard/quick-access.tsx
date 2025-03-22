"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { User, BookmarkCheck, Clock, Heart, MessageSquare, Settings, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"

interface QuickAccessProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export default function QuickAccess({ user }: QuickAccessProps) {
  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-5">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-16 w-16 overflow-hidden rounded-full">
          <Image
            src={user.image || "/placeholder.svg?height=64&width=64"}
            alt={user.name || "Usuario"}
            width={64}
            height={64}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold">{user.name || "Usuario"}</h2>
          <p className="text-sm text-zinc-400">@{user.name?.toLowerCase().replace(/\s+/g, "") || "usuario"}</p>
        </div>
      </div>

      <div className="space-y-2">
        <QuickAccessLink href="/profile" icon={<User className="h-4 w-4" />} label="Mi Perfil" delay={0.1} />
        <QuickAccessLink
          href="/watchlist"
          icon={<BookmarkCheck className="h-4 w-4" />}
          label="Watchlist"
          count={12}
          delay={0.2}
        />
        <QuickAccessLink href="/history" icon={<Clock className="h-4 w-4" />} label="Historial" delay={0.3} />
        <QuickAccessLink
          href="/favorites"
          icon={<Heart className="h-4 w-4" />}
          label="Favoritos"
          count={8}
          delay={0.4}
        />
        <QuickAccessLink
          href="/discussions"
          icon={<MessageSquare className="h-4 w-4" />}
          label="Mis Discusiones"
          count={3}
          delay={0.5}
        />
        <QuickAccessLink href="/settings" icon={<Settings className="h-4 w-4" />} label="Configuración" delay={0.6} />
      </div>

      <div className="mt-6 pt-4 border-t border-zinc-800">
        <Button className="w-full bg-red-600 hover:bg-red-700 text-white">Nueva Reseña</Button>
      </div>
    </section>
  )
}

interface QuickAccessLinkProps {
  href: string
  icon: React.ReactNode
  label: string
  count?: number
  delay: number
}

function QuickAccessLink({ href, icon, label, count, delay }: QuickAccessLinkProps) {
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay }}>
      <Link
        href={href}
        className="flex items-center justify-between p-2 rounded-md hover:bg-zinc-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-400">{icon}</div>
          <span>{label}</span>
        </div>
        <div className="flex items-center">
          {count !== undefined && <span className="mr-2 text-sm text-zinc-400">{count}</span>}
          <ChevronRight className="h-4 w-4 text-zinc-500" />
        </div>
      </Link>
    </motion.div>
  )
}

