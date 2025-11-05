"use client"

import { useEffect, useState } from "react"
import { useApiStats } from "@/lib/api-monitor"

export function PerformanceMonitor() {
  const [isOpen, setIsOpen] = useState(false)
  const [serverStats, setServerStats] = useState<any>(null)
  const stats = useApiStats()

  useEffect(() => {
    // Fetch server-side stats
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setServerStats(data))
      .catch(() => {})
  }, [])

  if (!stats) return null

  // Only show in development or if explicitly enabled
  if (process.env.NODE_ENV === 'production' && !localStorage.getItem('show-performance-monitor')) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[var(--primary)] text-black px-3 py-2 rounded-lg shadow-lg text-xs font-bold hover:opacity-90"
        >
          📊 Stats
        </button>
      ) : (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-xl p-4 max-w-md max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold">Performance Stats</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="font-semibold mb-1">API Calls</div>
              <div className="space-y-1 text-[var(--text-muted)]">
                <div>Total: {stats.totalCalls}</div>
                <div>Cached: {stats.cachedCalls} ({stats.cacheHitRate}%)</div>
                <div>Rate: {stats.callsPerSecond} calls/sec</div>
                <div>Avg Duration: {stats.averageDuration}ms</div>
              </div>
            </div>

            <div>
              <div className="font-semibold mb-1">Session</div>
              <div className="space-y-1 text-[var(--text-muted)]">
                <div>Duration: {(stats.duration / 1000).toFixed(1)}s</div>
                <div>Session ID: {stats.sessionId.slice(0, 20)}...</div>
              </div>
            </div>

            {stats.callsByEndpoint && Object.keys(stats.callsByEndpoint).length > 0 && (
              <div>
                <div className="font-semibold mb-1">By Endpoint</div>
                <div className="space-y-1 text-[var(--text-muted)] max-h-32 overflow-y-auto">
                  {Object.entries(stats.callsByEndpoint)
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .slice(0, 10)
                    .map(([endpoint, count]) => (
                      <div key={endpoint} className="flex justify-between">
                        <span className="truncate">{endpoint}</span>
                        <span>{count as number}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {serverStats?.currentSession && (
              <div>
                <div className="font-semibold mb-1">DB Queries</div>
                <div className="space-y-1 text-[var(--text-muted)]">
                  <div>Count: {serverStats.currentSession.queryCount || 0}</div>
                  <div>Rate: {serverStats.currentSession.queriesPerSecond || 0} queries/sec</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

