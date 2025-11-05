"use client"

import { FeedCardLog } from "@/components/feed-card-log"
import { Icon } from "@iconify/react"
import Link from "next/link"
import { useLogs, useTools, useProjects } from "@/lib/api-hooks"

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 animate-pulse">
          <div className="flex gap-3">
            <div className="h-10 w-10 rounded-full bg-[var(--bg)]" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-[var(--bg)] rounded w-3/4" />
              <div className="h-3 bg-[var(--bg)] rounded w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function FeedPage() {
  // Use React Query hooks for automatic caching
  const { data: logsData = [], isLoading: logsLoading } = useLogs({ limit: 20 })
  const { data: toolsData = [], isLoading: toolsLoading } = useTools({ limit: 6 })
  const { data: projectsData = [], isLoading: projectsLoading } = useProjects({ limit: 5 })

  const loading = logsLoading || toolsLoading || projectsLoading
  const logs = logsData || []
  const tools = toolsData || []
  const projects = projectsData || []

  function getColorByIcon(icon: string) {
    return tools.find((t) => t.icon === icon)?.color || undefined
  }

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-6 animate-in">
      {/* Mobile: Logs first, full width */}
      {/* Desktop: Logs on left, sidebar on right */}
      <section className="lg:col-span-8 space-y-3 sm:space-y-4 order-1">
        <h2 className="mb-2 text-xs sm:text-sm uppercase tracking-wide text-[var(--text-muted)] px-1">Recent Activity</h2>
        {loading ? (
          <LoadingSkeleton />
        ) : logs.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-[var(--text-muted)] px-4">
            <Icon icon="mdi:newspaper-outline" width={40} height={40} className="sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-50" />
            <p className="text-base sm:text-lg mb-2">No logs yet</p>
            <Link href="/log/new" className="mt-4 inline-block text-sm sm:text-base text-[var(--primary)] hover:underline transition-colors">
              Create your first log →
            </Link>
          </div>
        ) : (
          logs.map((item) => <FeedCardLog key={item.id} item={item} />)
        )}
      </section>
      {/* Mobile: Sidebar moved to bottom, simplified */}
      <aside className="lg:col-span-4 space-y-4 sm:space-y-6 order-2 lg:order-2">
        {/* Mobile: Compact cards, Desktop: Full sidebar */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4">
          <h3 className="mb-2 sm:mb-3 text-xs sm:text-sm uppercase tracking-wide text-[var(--text-muted)] hidden lg:block">Trending Tools</h3>
          <h3 className="mb-2 sm:mb-3 text-xs sm:text-sm uppercase tracking-wide text-[var(--text-muted)] lg:hidden">Trending</h3>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="h-9 w-9 rounded-md bg-[var(--bg)]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[var(--bg)] rounded w-2/3" />
                    <div className="h-3 bg-[var(--bg)] rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : tools.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No tools yet</p>
          ) : (
            <>
            {/* Mobile: Horizontal scroll, Desktop: Vertical list */}
            <div className="lg:hidden">
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                {tools.map((t) => (
                  <Link 
                    key={t.slug || t.id} 
                    href={`/tools/${t.slug}`}
                    className="flex flex-col items-center gap-1.5 min-w-[80px] p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--bg)] transition-colors group flex-shrink-0"
                  >
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg)] transition-transform group-hover:scale-110"
                      style={{ background: (t.color || "#888") + "12" }}
                    >
                      <Icon icon={t.icon} width={20} height={20} style={{ color: t.color }} />
                    </div>
                    <p className="text-[10px] font-semibold truncate w-full text-center" style={{ color: t.color }}>
                      {t.name}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
            {/* Desktop: Vertical list */}
            <ul className="hidden lg:block space-y-2 sm:space-y-3">
              {tools.map((t) => (
                <li key={t.slug || t.id} className="flex items-center justify-between">
                  <Link href={`/tools/${t.slug}`} className="flex items-center gap-2 sm:gap-3 hover:underline transition-colors group flex-1 min-w-0">
                    <div
                      className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg)] transition-transform group-hover:scale-110 flex-shrink-0"
                      style={{ background: (t.color || "#888") + "12" }}
                    >
                      <Icon icon={t.icon} width={18} height={18} className="sm:w-[22px] sm:h-[22px]" style={{ color: t.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold truncate" style={{ color: t.color }}>
                        {t.name}
                      </p>
                      <p className="text-[10px] sm:text-xs text-[var(--text-muted)] truncate">
                        {(t.avgRating || 0).toFixed(1)} · {(t.usedByCount || 0).toLocaleString()} users
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            </>
          )}
        </div>
        {/* Mobile: Hide projects section, Desktop: Show */}
        <div className="hidden lg:block rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4">
          <h3 className="mb-2 sm:mb-3 text-xs sm:text-sm uppercase tracking-wide text-[var(--text-muted)]">Recently Logged Projects</h3>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="h-10 w-16 rounded-md bg-[var(--bg)]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[var(--bg)] rounded w-3/4" />
                    <div className="h-3 bg-[var(--bg)] rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No projects yet</p>
          ) : (
            <ul className="space-y-2 sm:space-y-3">
              {projects.map((p) => (
                <li key={p.id} className="flex items-center gap-2 sm:gap-3 group">
                  <div
                    className="h-8 w-12 sm:h-10 sm:w-16 overflow-hidden rounded-md border border-[var(--border)] bg-[var(--bg)] transition-transform group-hover:scale-105 flex-shrink-0"
                    style={{
                      backgroundImage: p.coverImage ? `url(${p.coverImage})` : undefined,
                      backgroundSize: "cover",
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <Link href={`/projects/${p.id}`} className="text-xs sm:text-sm font-semibold hover:underline transition-colors block truncate">
                      {p.displayName || p.name}
                    </Link>
                    <div className="mt-1 flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-[var(--text-muted)]">
                      {p.tools?.slice(0, 3).map((icon: string, idx: number) => (
                        <Icon key={idx} icon={icon} width={14} height={14} className="sm:w-4 sm:h-4" style={{ color: getColorByIcon(icon) }} />
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  )
}
