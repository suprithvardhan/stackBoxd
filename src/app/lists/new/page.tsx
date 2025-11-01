"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { api } from "@/lib/api";
import { Icon } from "@iconify/react";
import Link from "next/link";

export default function NewListPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [availableTools, setAvailableTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }

    const loadTools = async () => {
      try {
        const toolsData = await api.tools.list({ limit: 200 });
        setAvailableTools(toolsData);
      } catch (error) {
        console.error("Failed to load tools:", error);
        setToast({ message: "Failed to load tools", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    loadTools();
  }, [session, router]);

  const filteredTools = availableTools.filter((tool) =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTool = (toolSlug: string) => {
    setSelectedTools((prev) =>
      prev.includes(toolSlug)
        ? prev.filter((slug) => slug !== toolSlug)
        : [...prev, toolSlug]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setToast({ message: "Title is required", type: "error" });
      return;
    }

    setSubmitting(true);
    try {
      const result = await api.lists.create({
        title: title.trim(),
        description: description.trim() || undefined,
        cover: cover.trim() || undefined,
        visibility,
        tools: selectedTools,
      });

      setToast({ message: "List created successfully!", type: "success" });
      setTimeout(() => {
        router.push(`/lists/${result.id}`);
      }, 1000);
    } catch (error: any) {
      console.error("Failed to create list:", error);
      setToast({
        message: error.message || "Failed to create list",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <>
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border ${
            toast.type === "success"
              ? "bg-green-900/20 border-green-500/50 text-green-400"
              : "bg-red-900/20 border-red-500/50 text-red-400"
          } animate-in slide-in-from-right-5`}
        >
          <div className="flex items-center gap-2">
            <Icon
              icon={toast.type === "success" ? "mdi:check-circle" : "mdi:alert-circle"}
              width={20}
              height={20}
            />
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              <Icon icon="mdi:close" width={16} height={16} />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold tracking-tight">Create New List</h1>
          <Link
            href="/lists"
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          >
            ← Back to Lists
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
            <h2 className="text-lg font-semibold">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium mb-2">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., My Favorite Frontend Tools"
                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this list is about..."
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Cover Image URL</label>
              <input
                type="url"
                value={cover}
                onChange={(e) => setCover(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            {/* Visibility Toggle */}
            <div>
              <label className="block text-sm font-medium mb-2">Visibility</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setVisibility("public")}
                  className={`flex-1 px-4 py-3 rounded-lg border transition-all ${
                    visibility === "public"
                      ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                      : "border-[var(--border)] bg-[var(--bg)] text-[var(--text-muted)] hover:border-[var(--primary)]/50"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Icon icon="mdi:earth" width={20} height={20} />
                    <span className="font-medium">Public</span>
                  </div>
                  <p className="text-xs mt-1 opacity-75">Anyone can view this list</p>
                </button>
                <button
                  type="button"
                  onClick={() => setVisibility("private")}
                  className={`flex-1 px-4 py-3 rounded-lg border transition-all ${
                    visibility === "private"
                      ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                      : "border-[var(--border)] bg-[var(--bg)] text-[var(--text-muted)] hover:border-[var(--primary)]/50"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Icon icon="mdi:lock" width={20} height={20} />
                    <span className="font-medium">Private</span>
                  </div>
                  <p className="text-xs mt-1 opacity-75">Only you can view this list</p>
                </button>
              </div>
            </div>
          </div>

          {/* Tools Selection */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col" style={{ minHeight: "600px" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Tools</h2>
              {selectedTools.length > 0 && (
                <span className="text-sm text-[var(--text-muted)]">
                  {selectedTools.length} selected
                </span>
              )}
            </div>

            {/* Selected Tools Display - Fixed height container */}
            <div className="min-h-[80px] mb-4 pb-4 border-b border-[var(--border)]">
              {selectedTools.length > 0 ? (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-[var(--text-muted)]">Selected Tools:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedTools.map((toolSlug) => {
                      const tool = availableTools.find((t) => t.slug === toolSlug);
                      if (!tool) return null;
                      return (
                        <button
                          key={toolSlug}
                          type="button"
                          onClick={() => toggleTool(toolSlug)}
                          className="group relative flex items-center gap-2 px-2 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--primary)] transition-all"
                          title={tool.name}
                        >
                          <div
                            className="flex h-6 w-6 items-center justify-center rounded border border-[var(--border)]"
                            style={{ background: (tool.color || "#999") + "12" }}
                          >
                            <Icon icon={tool.icon} width={14} height={14} style={{ color: tool.color }} />
                          </div>
                          <span className="text-xs font-medium text-[var(--text)]">{tool.name}</span>
                          <Icon
                            icon="mdi:close"
                            width={14}
                            height={14}
                            className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity"
                          />
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="text-sm text-[var(--text-muted)] opacity-50">No tools selected yet</div>
              )}
            </div>

            {/* Search - Fixed height */}
            <div className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools..."
                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            {/* Tools Grid - Fixed height container */}
            <div className="flex-1 min-h-0">
              {loading ? (
                <div className="text-center py-8 text-[var(--text-muted)] h-full flex items-center justify-center">Loading tools...</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 h-full overflow-y-auto">
                  {filteredTools.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-[var(--text-muted)]">
                      No tools found matching "{searchQuery}"
                    </div>
                  ) : (
                    filteredTools.map((tool) => {
                      const isSelected = selectedTools.includes(tool.slug);
                      return (
                        <button
                          key={tool.slug}
                          type="button"
                          onClick={() => toggleTool(tool.slug)}
                          className={`p-3 rounded-lg border transition-all text-left ${
                            isSelected
                              ? "border-[var(--primary)] bg-[var(--primary)]/10"
                              : "border-[var(--border)] bg-[var(--bg)] hover:border-[var(--primary)]/50"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border)]"
                              style={{ background: (tool.color || "#999") + "12" }}
                            >
                              <Icon icon={tool.icon} width={18} height={18} style={{ color: tool.color }} />
                            </div>
                            {isSelected && (
                              <Icon icon="mdi:check-circle" width={16} height={16} className="text-[var(--primary)]" />
                            )}
                          </div>
                          <div className="text-sm font-medium">{tool.name}</div>
                          <div className="text-xs text-[var(--text-muted)]">{tool.category}</div>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3">
            <Link
              href="/lists"
              className="px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--text)] hover:bg-white/5 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting || !title.trim()}
              className="px-6 py-2 rounded-lg bg-[var(--primary)] text-black font-medium shadow-[0_0_0_1px_#00FF8F40,_0_8px_30px_rgba(0,0,0,0.6)] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Icon icon="mdi:loading" className="animate-spin" width={18} height={18} />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Icon icon="mdi:check" width={18} height={18} />
                  <span>Create List</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
