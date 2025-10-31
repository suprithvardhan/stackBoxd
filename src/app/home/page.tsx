"use client"

import { useEffect, useState } from "react"
import { FeedCardLog } from "@/components/feed-card-log"
import { api } from "@/lib/api"
import { Icon } from "@iconify/react"
import Link from "next/link"

export default function FeedPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [tools, setTools] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [logsData, toolsData, projectsData] = await Promise.all([
          api.logs.list({ limit: 20 }),
          api.tools.list({ limit: 6 }),
          api.projects.list({ limit: 5 }),
        ])
        setLogs(logsData)
        setTools(toolsData)
        setProjects(projectsData)
      } catch (error) {
        console.error("Failed to load data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  function getColorByIcon(icon: string) {
    return tools.find((t) => t.icon === icon)?.color || undefined
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[var(--text-muted)]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
      <section className="md:col-span-8 space-y-4">
        <h2 className="mb-2 text-sm uppercase tracking-wide text-[var(--text-muted)]">Recent Activity</h2>
        {logs.length === 0 ? (
          <div className="text-center py-12 text-[var(--text-muted)]">
            <p>No logs yet. Be the first to log a tool!</p>
            <Link href="/log/new" className="mt-4 inline-block text-[var(--primary)] hover:underline">
              Create your first log
            </Link>
          </div>
        ) : (
          logs.map((item) => <FeedCardLog key={item.id} item={item} />)
        )}
      </section>
      <aside className="md:col-span-4 space-y-6">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <h3 className="mb-3 text-sm uppercase tracking-wide text-[var(--text-muted)]">Trending Tools</h3>
          {tools.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No tools yet</p>
          ) : (
            <ul className="space-y-3">
              {tools.map((t) => (
                <li key={t.slug || t.id} className="flex items-center justify-between">
                  <Link href={`/${t.slug}`} className="flex items-center gap-3 hover:underline">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg)]"
                      style={{ background: (t.color || "#888") + "12" }}
                    >
                      <Icon icon={t.icon} width={22} height={22} style={{ color: t.color }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: t.color }}>
                        {t.name}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {t.avgRating.toFixed(1)} · Used by {t.usedByCount.toLocaleString()}
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
          {projects.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No projects yet</p>
          ) : (
            <ul className="space-y-3">
              {projects.map((p) => (
                <li key={p.id} className="flex items-center gap-3">
                  <div
                    className="h-10 w-16 overflow-hidden rounded-md border border-[var(--border)] bg-[var(--bg)]"
                    style={{
                      backgroundImage: p.coverImage ? `url(${p.coverImage})` : undefined,
                      backgroundSize: "cover",
                    }}
                  />
                  <div className="flex-1">
                    <Link href={`/projects/${p.id}`} className="text-sm font-semibold hover:underline">
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
