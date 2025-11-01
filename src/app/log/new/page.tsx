"use client"

import { useState, useEffect } from "react"
import { Icon } from "@iconify/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { api } from "@/lib/api"
import Link from "next/link"

function Toast({ message, type = "success", onClose }: { message: string; type?: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm ${
        type === "success"
          ? "border-green-500/50 bg-green-500/10 text-green-400"
          : "border-red-500/50 bg-red-500/10 text-red-400"
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon icon={type === "success" ? "mdi:check-circle" : "mdi:alert-circle"} width={20} height={20} />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  )
}

export default function NewLogPage() {
  const router = useRouter()
  const params = useSearchParams()
  const { data: session, status } = useSession()
  const presetTool = params.get("tool")

  const [tools, setTools] = useState<any[]>([])
  const [toolQuery, setToolQuery] = useState("")
  const [selectedTool, setSelectedTool] = useState<any | null>(null)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [review, setReview] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [visibility, setVisibility] = useState<"public" | "private">("public")
  const [projectId, setProjectId] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [loadingTools, setLoadingTools] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [showToolDropdown, setShowToolDropdown] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    // Load tools
    const loadTools = async () => {
      try {
        const toolsData = await api.tools.list({ limit: 200 })
        setTools(toolsData)
      } catch (error) {
        console.error("Failed to load tools:", error)
        setToast({ message: "Failed to load tools", type: "error" })
      } finally {
        setLoadingTools(false)
      }
    }

    if (status === "authenticated") {
      loadTools()

      // If preset tool, find and set it
      if (presetTool) {
        api.tools
          .get(presetTool)
          .then((tool) => {
            setSelectedTool(tool)
            setToolQuery(tool.name)
          })
          .catch(console.error)
      }
    }
  }, [presetTool, status, router])

  const filtered = tools.filter((t) =>
    t.name.toLowerCase().includes(toolQuery.toLowerCase()) ||
    t.slug.toLowerCase().includes(toolQuery.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
      setToast({ message: "Log published successfully!", type: "success" })
      setTimeout(() => {
        router.push("/home")
      }, 1000)
    } catch (error) {
      console.error("Failed to create log:", error)
      setToast({ message: "Failed to create log. Please try again.", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[var(--text-muted)]">Loading...</div>
      </div>
    )
  }

  const canSubmit = selectedTool && rating >= 1 && review.trim().length >= 10

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Log a Tool</h1>
            <p className="text-[var(--text-muted)]">Share your experience with the developer community</p>
          </div>
          <Link
            href="/home"
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors flex items-center gap-2"
          >
            <Icon icon="mdi:close" width={18} height={18} />
            Cancel
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tool Selection */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-3 text-[var(--text)]">
                  Select Tool <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="relative">
                    <input
                      type="text"
                      value={toolQuery}
                      onChange={(e) => {
                        setToolQuery(e.target.value)
                        setShowToolDropdown(true)
                      }}
                      onFocus={() => setShowToolDropdown(true)}
                      placeholder="Search for a tool..."
                      className="w-full px-4 py-3 pl-12 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                    />
                    <Icon
                      icon="mdi:magnify"
                      width={20}
                      height={20}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)]"
                    />
                  </div>

                  {showToolDropdown && toolQuery && filtered.length > 0 && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowToolDropdown(false)}
                      />
                      <div className="absolute z-20 mt-2 w-full max-h-64 overflow-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-xl">
                        {filtered.slice(0, 10).map((t) => (
                          <button
                            key={t.slug || t.id}
                            type="button"
                            onClick={() => {
                              setSelectedTool(t)
                              setToolQuery(t.name)
                              setShowToolDropdown(false)
                            }}
                            className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[var(--bg)] transition-colors border-b border-[var(--border)] last:border-b-0"
                          >
                            <div
                              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] transition-transform hover:scale-110"
                              style={{
                                background: `${t.color || "#888"}15`,
                                borderColor: `${t.color || "#888"}30`,
                              }}
                            >
                              <Icon icon={t.icon} width={20} height={20} style={{ color: t.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[var(--text)] truncate">{t.name}</p>
                              <p className="text-xs text-[var(--text-muted)] capitalize">{t.category}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {selectedTool && (
                  <div className="mt-4 flex items-center gap-3 p-4 rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/5">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-lg border-2"
                      style={{
                        background: `${selectedTool.color || "#888"}20`,
                        borderColor: selectedTool.color || "#888",
                      }}
                    >
                      <Icon icon={selectedTool.icon} width={24} height={24} style={{ color: selectedTool.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[var(--text)]">{selectedTool.name}</p>
                      <p className="text-xs text-[var(--text-muted)] capitalize">{selectedTool.category}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTool(null)
                        setToolQuery("")
                      }}
                      className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                    >
                      <Icon icon="mdi:close" width={20} height={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Rating */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
              <label className="block text-sm font-semibold text-[var(--text)]">
                Rating <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Icon
                        icon="mdi:star"
                        width={36}
                        height={36}
                        className={
                          star <= (hoveredRating || rating)
                            ? "text-yellow-400 fill-current"
                            : "text-[var(--text-muted)]/30 fill-current"
                        }
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <span className="text-lg font-semibold text-[var(--text)]">
                    {rating} {rating === 1 ? "star" : "stars"}
                  </span>
                )}
              </div>
            </div>

            {/* Review */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-[var(--text)]">
                  Review <span className="text-red-400">*</span>
                </label>
                <span
                  className={`text-xs ${
                    review.trim().length < 10
                      ? "text-red-400"
                      : review.trim().length > 5000
                      ? "text-red-400"
                      : "text-[var(--text-muted)]"
                  }`}
                >
                  {review.trim().length}/5000
                </span>
              </div>
              <div className="relative">
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows={10}
                  placeholder="Share your experience with this tool... What did you like? What could be improved? Be specific and helpful!"
                  className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                  style={{ minHeight: "240px", maxHeight: "400px" }}
                  maxLength={5000}
                />
              </div>
              {review.trim().length > 0 && review.trim().length < 10 && (
                <p className="text-xs text-red-400">Review must be at least 10 characters</p>
              )}
            </div>

            {/* Tags */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
              <label className="block text-sm font-semibold text-[var(--text)]">Tags (optional)</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-sm text-[var(--text)]"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => setTags(tags.filter((t) => t !== tag))}
                      className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                    >
                      <Icon icon="mdi:close" width={14} height={14} />
                    </button>
                  </span>
                ))}
                <TagAdder onAdd={(t) => setTags((prev) => Array.from(new Set([...prev, t.toLowerCase()])))} />
              </div>
            </div>

            {/* Project & Visibility */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
                <label className="block text-sm font-semibold text-[var(--text)]">Project (optional)</label>
                <input
                  type="text"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  placeholder="Project ID"
                  className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                />
              </div>

              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
                <label className="block text-sm font-semibold text-[var(--text)] mb-3">Visibility</label>
                <div className="flex gap-4">
                  <label className="flex-1">
                    <input
                      type="radio"
                      name="visibility"
                      checked={visibility === "public"}
                      onChange={() => setVisibility("public")}
                      className="sr-only peer"
                    />
                    <div className="flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all peer-checked:border-[var(--primary)] peer-checked:bg-[var(--primary)]/10 peer-checked:text-[var(--primary)] border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)]/50">
                      <Icon icon="mdi:earth" width={18} height={18} />
                      <span className="text-sm font-medium">Public</span>
                    </div>
                  </label>
                  <label className="flex-1">
                    <input
                      type="radio"
                      name="visibility"
                      checked={visibility === "private"}
                      onChange={() => setVisibility("private")}
                      className="sr-only peer"
                    />
                    <div className="flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all peer-checked:border-[var(--primary)] peer-checked:bg-[var(--primary)]/10 peer-checked:text-[var(--primary)] border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)]/50">
                      <Icon icon="mdi:lock" width={18} height={18} />
                      <span className="text-sm font-medium">Private</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 rounded-lg border border-[var(--border)] text-[var(--text)] hover:bg-white/5 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !canSubmit}
                className="px-8 py-3 rounded-lg bg-[var(--primary)] text-black font-bold shadow-[0_0_0_1px_#00FF8F40,_0_8px_30px_rgba(0,0,0,0.6)] hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Icon icon="mdi:loading" className="animate-spin" width={20} height={20} />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Icon icon="mdi:check-circle" width={20} height={20} />
                    <span>Publish Log</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <div>
                <h2 className="text-sm uppercase tracking-wide text-[var(--text-muted)] mb-4">Preview</h2>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6" style={{ minHeight: "400px", maxHeight: "600px" }}>
                  {selectedTool ? (
                    <div className="space-y-4 h-full flex flex-col">
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-[var(--bg)] border-2 border-[var(--border)] flex items-center justify-center text-sm font-semibold">
                          {session?.user?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[var(--text)] truncate">
                            {session?.user?.name || "You"}
                          </p>
                          <p className="text-xs text-[var(--text-muted)]">logged</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] flex-shrink-0">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-lg border-2"
                          style={{
                            background: `${selectedTool.color || "#888"}20`,
                            borderColor: selectedTool.color || "#888",
                          }}
                        >
                          <Icon icon={selectedTool.icon} width={20} height={20} style={{ color: selectedTool.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[var(--text)] truncate">{selectedTool.name}</p>
                          <p className="text-xs text-[var(--text-muted)] capitalize">{selectedTool.category}</p>
                        </div>
                      </div>

                      {rating > 0 && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {[...Array(5)].map((_, i) => (
                            <Icon
                              key={i}
                              icon="mdi:star"
                              width={16}
                              height={16}
                              className={i < rating ? "text-yellow-400 fill-current" : "text-[var(--text-muted)]/30 fill-current"}
                            />
                          ))}
                        </div>
                      )}

                      <div className="pt-2 border-t border-[var(--border)] flex-1 min-h-0 overflow-hidden">
                        <div className="h-full overflow-y-auto">
                          <p className="text-sm text-[var(--text-muted)] whitespace-pre-wrap break-words">
                            {review || (
                              <span className="italic opacity-50">Your review preview will appear here...</span>
                            )}
                          </p>
                        </div>
                      </div>

                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border)] flex-shrink-0">
                          {tags.map((tag) => (
                            <span key={tag} className="text-xs px-2 py-1 rounded-full bg-[var(--bg)] border border-[var(--border)] text-[var(--text-muted)]">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-2 border-t border-[var(--border)] flex-shrink-0">
                        <Icon
                          icon={visibility === "public" ? "mdi:earth" : "mdi:lock"}
                          width={14}
                          height={14}
                          className="text-[var(--text-muted)]"
                        />
                        <span className="text-xs text-[var(--text-muted)] capitalize">{visibility}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[var(--text-muted)] h-full flex items-center justify-center">
                      <div>
                        <Icon icon="mdi:file-document-outline" width={48} height={48} className="mx-auto mb-3 opacity-50" />
                        <p className="text-sm">Select a tool to see preview</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </>
  )
}

function TagAdder({ onAdd }: { onAdd: (t: string) => void }) {
  const [val, setVal] = useState("")
  const [showInput, setShowInput] = useState(false)

  if (!showInput) {
    return (
      <button
        type="button"
        onClick={() => setShowInput(true)}
        className="inline-flex items-center gap-1 rounded-full border border-dashed border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--primary)]/50 transition-all"
      >
        <Icon icon="mdi:plus" width={16} height={16} />
        <span>Add tag</span>
      </button>
    )
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5">
      <input
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="tag"
        className="w-20 bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]"
        onKeyDown={(e) => {
          if (e.key === "Enter" && val.trim()) {
            onAdd(val.trim())
            setVal("")
            setShowInput(false)
          }
          if (e.key === "Escape") {
            setShowInput(false)
            setVal("")
          }
        }}
        onBlur={() => {
          if (val.trim()) {
            onAdd(val.trim())
            setVal("")
          }
          setShowInput(false)
        }}
        autoFocus
      />
    </div>
  )
}
