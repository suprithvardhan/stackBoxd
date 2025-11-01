"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Icon } from "@iconify/react"
import { api } from "@/lib/api"
import Link from "next/link"

export default function ShareCardPage() {
  const params = useParams()
  const logId = params.id as string
  const [loading, setLoading] = useState(true)
  const [log, setLog] = useState<any>(null)

  useEffect(() => {
    const loadLog = async () => {
      try {
        const logData = await api.logs.get(logId)
        setLog(logData)
      } catch (error) {
        console.error("Failed to load log:", error)
      } finally {
        setLoading(false)
      }
    }
    if (logId) {
      loadLog()
    }
  }, [logId])

  const handleDownload = async (format: "png" | "jpeg" = "png") => {
    try {
      const response = await fetch(`/api/og/log/${logId}?format=${format}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `stackboxd-${log?.userData?.username || "user"}-${log?.tool?.name || "tool"}.${format === "png" ? "png" : "jpg"}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to download:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-[var(--text-muted)]">Loading...</div>
      </div>
    )
  }

  if (!log) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-[var(--text-muted)]">Log not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            href={`/logs/${logId}`}
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors flex items-center gap-2"
          >
            <Icon icon="mdi:arrow-left" width={18} height={18} />
            Back to log
          </Link>
        </div>

        {/* Share Card Preview */}
        <div className="flex items-center justify-center">
          <div className="relative">
            <img
              src={`/api/og/log/${logId}?format=png`}
              alt="Share card"
              className="max-w-full h-auto rounded-xl border-2 border-[var(--border)] shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-xl pointer-events-none" />
          </div>
        </div>

        {/* Share Options */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => handleDownload("png")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--primary)] text-black font-bold shadow-[0_0_0_1px_#00FF8F40,_0_8px_30px_rgba(0,0,0,0.6)] hover:opacity-90 transition-all"
          >
            <Icon icon="mdi:download" width={20} height={20} />
            <span>Download PNG</span>
          </button>
          <button
            onClick={() => handleDownload("jpeg")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:bg-white/5 transition-colors"
          >
            <Icon icon="mdi:download" width={20} height={20} />
            <span>Download JPEG</span>
          </button>
          <button
            onClick={async () => {
              const url = `${window.location.origin}/logs/${logId}`
              if (navigator.share) {
                await navigator.share({
                  title: `${log.userData?.displayName || log.user}'s review of ${log.tool?.name}`,
                  text: log.review?.substring(0, 200),
                  url,
                })
              } else {
                navigator.clipboard.writeText(url)
              }
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:bg-white/5 transition-colors"
          >
            <Icon icon="mdi:share-variant" width={20} height={20} />
            <span>Share Link</span>
          </button>
        </div>
      </div>
    </div>
  )
}

