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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-12 animate-in">
      <section className="md:col-span-8 space-y-4">
        <h2 className="mb-2 text-sm uppercase tracking-wide text-[var(--text-muted)]">Recent Activity</h2>
        {loading ? (
          <LoadingSkeleton />
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-[var(--text-muted)]">
            <Icon icon="mdi:newspaper-outline" width={48} height={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">No logs yet</p>
            <Link href="/log/new" className="mt-4 inline-block text-[var(--primary)] hover:underline transition-colors">
              Create your first log →
            </Link>
          </div>
        ) : (
          logs.map((item) => <FeedCardLog key={item.id} item={item} />)
        )}
      </section>
      <aside className="md:col-span-4 space-y-6">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <h3 className="mb-3 text-sm uppercase tracking-wide text-[var(--text-muted)]">Trending Tools</h3>
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
            <ul className="space-y-3">
              {tools.map((t) => (
                <li key={t.slug || t.id} className="flex items-center justify-between">
                  <Link href={`/tools/${t.slug}`} className="flex items-center gap-3 hover:underline transition-colors group">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg)] transition-transform group-hover:scale-110"
                      style={{ background: (t.color || "#888") + "12" }}
                    >
                      <Icon icon={t.icon} width={22} height={22} style={{ color: t.color }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: t.color }}>
                        {t.name}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {(t.avgRating || 0).toFixed(1)} · Used by {(t.usedByCount || 0).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <h3 className="mb-3 text-sm uppercase tracking-wide text-[var(--text-muted)]">Recently Logged Projects</h3>
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
            <ul className="space-y-3">
              {projects.map((p) => (
                <li key={p.id} className="flex items-center gap-3 group">
                  <div
                    className="h-10 w-16 overflow-hidden rounded-md border border-[var(--border)] bg-[var(--bg)] transition-transform group-hover:scale-105"
                    style={{
                      backgroundImage: p.coverImage ? `url(${p.coverImage})` : undefined,
                      backgroundSize: "cover",
                    }}
                  />
                  <div className="flex-1">
                    <Link href={`/projects/${p.id}`} className="text-sm font-semibold hover:underline transition-colors">
                      {p.displayName || p.name}
                    </Link>
                    <div className="mt-1 flex items-center gap-2 text-xs text-[var(--text-muted)]">
                      {p.tools?.slice(0, 3).map((icon: string, idx: number) => (
                        <Icon key={idx} icon={icon} width={16} height={16} style={{ color: getColorByIcon(icon) }} />
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
