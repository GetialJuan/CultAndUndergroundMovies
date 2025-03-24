import { Suspense } from "react"

// Componentes para la página principal
import ActivityFeed from "@/components/dashboard/activity-feed"
import MovieRecommendations from "@/components/dashboard/movie-recommendations"
import QuickAccess from "@/components/dashboard/quick-access"
import MobileNavigation from "@/components/dashboard/mobile-navigation"

export default async function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* Mobile Navigation (visible on small screens) */}
      <MobileNavigation />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Quick Access Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <QuickAccess />
          </aside>

          {/* Activity Feed */}
          <section className="lg:col-span-6">
            <h2 className="text-2xl font-bold mb-6">Your Feed</h2>
            <Suspense fallback={<div className="h-64 bg-zinc-900 animate-pulse rounded-lg"></div>}>
              <ActivityFeed />
            </Suspense>
          </section>

          {/* Recommendations */}
          <aside className="lg:col-span-3">
            <h2 className="text-2xl font-bold mb-6">Recommended For You</h2>
            <Suspense fallback={<div className="h-64 bg-zinc-900 animate-pulse rounded-lg"></div>}>
              <MovieRecommendations />
            </Suspense>
          </aside>
        </div>
      </main>
    </div>
  )
}

