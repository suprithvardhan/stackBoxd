"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Icon } from "@iconify/react"
import { api } from "@/lib/api"
import Link from "next/link"

export function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<{ tools: any[]; users: any[]; lists: any[] }>({
    tools: [],
    users: [],
    lists: [],
  })
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!query.trim()) {
      setResults({ tools: [], users: [], lists: [] })
      return
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await api.search.search(query.trim(), 5)
        setResults(data)
        // Track search (analytics tracked on backend)
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        // Modal is controlled by parent
      }
      if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  if (!isOpen) return null

  const totalResults = results.tools.length + results.users.length + results.lists.length

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        <div
          className="w-full max-w-2xl rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="relative p-4 border-b border-[var(--border)]">
            <Icon
              icon="mdi:magnify"
              width={20}
              height={20}
              className="absolute left-7 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools, users, lists..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-7 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                <Icon icon="mdi:close" width={18} height={18} />
              </button>
            )}
          </div>

          {/* Results */}
          <div className="max-h-[500px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-[var(--text-muted)]">
                <Icon icon="mdi:loading" className="animate-spin mx-auto mb-2" width={24} height={24} />
                <p className="text-sm">Searching...</p>
              </div>
            ) : query.trim() && totalResults === 0 ? (
              <div className="p-8 text-center text-[var(--text-muted)]">
                <Icon icon="mdi:magnify" width={48} height={48} className="mx-auto mb-3 opacity-50" />
                <p className="text-sm">No results found</p>
              </div>
            ) : query.trim() === "" ? (
              <div className="p-8 text-center text-[var(--text-muted)]">
                <Icon icon="mdi:magnify" width={48} height={48} className="mx-auto mb-3 opacity-50" />
                <p className="text-sm">Start typing to search...</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {/* Tools */}
                {results.tools.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-[var(--bg)] border-b border-[var(--border)]">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Tools</p>
                    </div>
                    {results.tools.map((tool) => (
                      <Link
                        key={tool.slug}
                        href={`/tools/${tool.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg)] transition-colors"
                      >
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)]"
                          style={{
                            background: `${tool.color || "#888"}15`,
                            borderColor: `${tool.color || "#888"}30`,
                          }}
                        >
                          <Icon icon={tool.icon} width={20} height={20} style={{ color: tool.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[var(--text)] truncate">{tool.name}</p>
                          <p className="text-xs text-[var(--text-muted)] capitalize">{tool.category}</p>
                        </div>
                        <Icon icon="mdi:chevron-right" width={20} height={20} className="text-[var(--text-muted)]" />
                      </Link>
                    ))}
                  </div>
                )}

                {/* Users */}
                {results.users.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-[var(--bg)] border-b border-[var(--border)]">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Users</p>
                    </div>
                    {results.users.map((user) => (
                      <Link
                        key={user.username}
                        href={`/profile/${user.username}`}
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg)] transition-colors"
                      >
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.displayName}
                            className="h-10 w-10 rounded-full border-2 border-[var(--border)]"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-[var(--bg)] border-2 border-[var(--border)] flex items-center justify-center text-sm font-semibold">
                            {user.displayName?.[0]?.toUpperCase() || user.username[0].toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[var(--text)] truncate">
                            {user.displayName || user.username}
                          </p>
                          <p className="text-xs text-[var(--text-muted)]">@{user.username}</p>
                        </div>
                        <Icon icon="mdi:chevron-right" width={20} height={20} className="text-[var(--text-muted)]" />
                      </Link>
                    ))}
                  </div>
                )}

                {/* Lists */}
                {results.lists.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-[var(--bg)] border-b border-[var(--border)]">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Lists</p>
                    </div>
                    {results.lists.map((list) => (
                      <Link
                        key={list.id}
                        href={`/lists/${list.id}`}
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg)] transition-colors"
                      >
                        {list.cover ? (
                          <div
                            className="h-10 w-10 rounded-lg border border-[var(--border)] bg-cover bg-center"
                            style={{ backgroundImage: `url(${list.cover})` }}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg border border-[var(--border)] bg-[var(--bg)] flex items-center justify-center">
                            <Icon icon="mdi:format-list-bulleted-square" width={20} height={20} className="text-[var(--text-muted)]" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[var(--text)] truncate">{list.title}</p>
                          <p className="text-xs text-[var(--text-muted)]">
                            by @{list.author} · {list.count} tools
                          </p>
                        </div>
                        <Icon icon="mdi:chevron-right" width={20} height={20} className="text-[var(--text-muted)]" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-[var(--border)] bg-[var(--bg)]">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)]">↑↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)]">Enter</kbd>
                  Select
                </span>
              </div>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)]">Esc</kbd>
                Close
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

