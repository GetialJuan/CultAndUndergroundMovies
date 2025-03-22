import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import AuthNavbar from "@/components/dashboard/auth-navbar"
import FeedSection from "@/components/dashboard/feed-section"
import TrendingSection from "@/components/dashboard/trending-section"
import FeaturedLists from "@/components/dashboard/featured-lists"
import QuickAccess from "@/components/dashboard/quick-access"
import ExploreFilms from "@/components/dashboard/explore-films"
import RecentActivity from "@/components/dashboard/recent-activity"
import DashboardFooter from "@/components/dashboard/dashboard-footer"

export default async function DashboardPage() {
  // Verificar autenticación del usuario
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Efecto de grano de película */}
      <div className="absolute inset-0 bg-[url('/film-grain.png')] opacity-10 mix-blend-overlay pointer-events-none z-10"></div>

      <AuthNavbar user={session.user} />

      <main className="container px-4 py-6 mx-auto">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Columna principal (2/3 en desktop) */}
          <div className="lg:col-span-2 space-y-8">
            <FeedSection />
            <TrendingSection />
            <ExploreFilms />
          </div>

          {/* Barra lateral (1/3 en desktop) */}
          <div className="space-y-8">
            <QuickAccess user={session.user} />
            <FeaturedLists />
            <RecentActivity />
          </div>
        </div>
      </main>

      <DashboardFooter />
    </div>
  )
}

