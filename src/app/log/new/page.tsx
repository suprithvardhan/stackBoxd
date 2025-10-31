"use client"

import { useState, useEffect } from "react"
import { Icon } from "@iconify/react"
import { Star, Save } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/hooks/use-auth"

export default function NewLogPage() {
  const router = useRouter()
  const params = useSearchParams()
  const { isAuthenticated } = useAuth()
  const presetTool = params.get("tool")

  const [tools, setTools] = useState<any[]>([])
  const [toolQuery, setToolQuery] = useState("")
  const [selectedTool, setSelectedTool] = useState<any | null>(null)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [visibility, setVisibility] = useState<"public" | "private">("public")
  const [projectId, setProjectId] = useState<string>("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // Load tools
    api.tools.list({ limit: 100 }).then(setTools).catch(console.error)

    // If preset tool, find and set it
    if (presetTool) {
      api.tools.get(presetTool).then((tool) => {
        setSelectedTool(tool)
        setToolQuery(tool.name)
      }).catch(console.error)
    }
  }, [presetTool, isAuthenticated, router])

  const filtered = tools.filter((t) =>
    t.name.toLowerCase().includes(toolQuery.toLowerCase())
  )

  const handleSubmit = async () => {
    if (!selectedTool || rating < 1 || review.trim().length < 10) return

    setLoading(true)
    try {
      await api.logs.create({
        toolId: selectedTool.slug || selectedTool.id,
        rating,
        review,
        tags,
        projectId: projectId || null,
        visibility,
      })
      router.push("/home")
    } catch (error) {
      console.error("Failed to create log:", error)
      alert("Failed to create log. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
      <section className="md:col-span-7 space-y-4">
        <h1 className="text-xl font-semibold">Log a tool</h1>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <label className="text-sm text-[var(--text-muted)]">Tool</label>
          <div className="mt-2">
            <input
              value={toolQuery}
              onChange={(e) => setToolQuery(e.target.value)}
              placeholder="Search tools…"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 outline-none focus:ring-2"
              style={{ outlineColor: "var(--ring)" }}
            />
            {toolQuery && (
              <ul className="mt-2 max-h-56 overflow-auto rounded-lg border border-[var(--border)] bg-[var(--bg)]">
                {filtered.map((t) => (
                  <li key={t.slug || t.id}>
                    <button
                      onClick={() => {
                        setSelectedTool(t)
                        setToolQuery(t.name)
                      }}
                      className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-white/5"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)]">
                        <Icon icon={t.icon} width={16} height={16} style={{ color: t.color }} />
                      </div>
                      <div>
                        <p className="text-sm">{t.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">{t.category}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <label className="text-sm text-[var(--text-muted)]">Project ID (optional)</label>
          <input
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            placeholder="Project ID"
            className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 outline-none focus:ring-2"
            style={{ outlineColor: "var(--ring)" }}
          />
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <label className="text-sm text-[var(--text-muted)]">Rating</label>
          <div className="mt-2 flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <button key={i} onClick={() => setRating(i + 1)}>
                <Star
                  className={i < rating ? "fill-[var(--accent)] stroke-[var(--accent)]" : "text-[var(--text-muted)]"}
                />
              </button>
            ))}
            <span className="text-sm text-[var(--text-muted)]">{rating} / 5</span>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <label className="text-sm text-[var(--text-muted)]">Review</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={8}
            placeholder="Share your experience…"
            className="mt-2 w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 outline-none focus:ring-2"
            style={{ outlineColor: "var(--ring)" }}
          />
          <div className="mt-3 flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <span key={t} className="rounded-full border border-[var(--border)] px-2 py-0.5 text-xs">
                  #{t}
                </span>
              ))}
            </div>
            <TagAdder onAdd={(t) => setTags((prev) => Array.from(new Set([...prev, t.toLowerCase()])))} />
          </div>
          <div className="mt-2 text-right text-xs text-[var(--text-muted)]">{review.trim().length}/5000</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="visibility"
                checked={visibility === "public"}
                onChange={() => setVisibility("public")}
              />
              Public
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="visibility"
                checked={visibility === "private"}
                onChange={() => setVisibility("private")}
              />
              Private
            </label>
          </div>

          <div className="flex gap-2">
            <button
              disabled={loading || !selectedTool || rating < 1 || review.trim().length < 10}
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-medium text-black shadow-[0_0_0_1px_#00FF8F40,_0_8px_30px_rgba(0,0,0,0.6)] transition disabled:opacity-50"
            >
              {loading ? "Publishing..." : "Publish Log"}
            </button>
          </div>
        </div>
      </section>

      <aside className="md:col-span-5 space-y-4">
        <h2 className="text-sm uppercase tracking-wide text-[var(--text-muted)]">Preview</h2>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="mb-3 flex items-center gap-3 text-sm text-[var(--text-muted)]">
            <div className="h-8 w-8 rounded-full bg-[var(--bg)]" />
            <div className="text-[var(--text)] font-medium">@you</div>
            <div>logged</div>
            <div className="flex items-center gap-2">
              {selectedTool ? (
                <>
                  <div className="flex h-6 w-6 items-center justify-center rounded border border-[var(--border)] bg-[var(--bg)]">
                    <Icon icon={selectedTool.icon} width={14} height={14} style={{ color: selectedTool.color }} />
                  </div>
                  <span>{selectedTool.name}</span>
                </>
              ) : (
                <span>Tool</span>
              )}
            </div>
          </div>
          <div className="mb-2 flex items-center gap-2">
            {Array.from({ length: rating }).map((_, i) => (
              <Star key={i} className="fill-[var(--accent)] stroke-[var(--accent)]" size={16} />
            ))}
          </div>
          <p className="text-[var(--text-muted)] min-h-16">{review || "Your review preview will appear here."}</p>
        </div>
      </aside>
    </div>
  )
}

function TagAdder({ onAdd }: { onAdd: (t: string) => void }) {
  const [val, setVal] = useState("")
  return (
    <div className="flex items-center gap-2">
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="Add tag"
        className="w-28 rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-xs outline-none focus:ring-2"
        style={{ outlineColor: "var(--ring)" }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && val.trim()) {
            onAdd(val.trim())
            setVal("")
          }
        }}
      />
      <button
        onClick={() => {
          if (val.trim()) {
            onAdd(val.trim())
            setVal("")
          }
        }}
        className="text-xs text-[var(--text-muted)] hover:text-[var(--text)]"
      >
        + Add
      </button>
    </div>
  )
}
