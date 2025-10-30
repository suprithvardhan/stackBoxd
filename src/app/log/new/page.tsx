"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { mockTools } from "@/lib/mock-data";
import { Star, Save } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function NewLogPage() {
  const router = useRouter();
  const params = useSearchParams();
  const presetTool = params.get("tool");
  const [toolQuery, setToolQuery] = useState(presetTool ? (mockTools.find(t=>t.slug===presetTool)?.name || "") : "");
  const [selectedTool, setSelectedTool] = useState<string | null>(presetTool);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [projectUrl, setProjectUrl] = useState("");
  const [screens, setScreens] = useState<string[]>([]);

  const filtered = mockTools.filter((t) =>
    t.name.toLowerCase().includes(toolQuery.toLowerCase())
  );

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
                  <li key={t.slug}>
                    <button
                      onClick={() => {
                        setSelectedTool(t.slug);
                        setToolQuery(t.name);
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
          <label className="text-sm text-[var(--text-muted)]">Project link (optional)</label>
          <input value={projectUrl} onChange={(e)=>setProjectUrl(e.target.value)} placeholder="https://github.com/you/project" className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 outline-none focus:ring-2" style={{ outlineColor: "var(--ring)" }} />
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
                <span key={t} className="rounded-full border border-[var(--border)] px-2 py-0.5 text-xs">#{t}</span>
              ))}
            </div>
            <TagAdder onAdd={(t)=> setTags((prev)=> Array.from(new Set([...prev, t.toLowerCase()]))) } />
          </div>
          <div className="mt-2 text-right text-xs text-[var(--text-muted)]">{review.trim().length}/5000</div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <label className="text-sm text-[var(--text-muted)]">Screenshots (URLs)</label>
          <div className="mt-2 flex gap-2">
            <button onClick={()=> setScreens((s)=> [...s, "https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=800&auto=format"]) } className="rounded-md border border-[var(--border)] px-2 py-1 text-xs">Add sample</button>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {screens.map((u, idx)=> (
              <div key={idx} className="aspect-video overflow-hidden rounded border border-[var(--border)] bg-[var(--bg)]" />
            ))}
          </div>
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
            <button className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--text)]">
              <Save size={16} /> Save Draft
            </button>
            <button
              disabled={!selectedTool || rating < 1 || review.trim().length < 10}
              onClick={() => router.replace("/home")}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-medium text-black shadow-[0_0_0_1px_#00FF8F40,_0_8px_30px_rgba(0,0,0,0.6)] transition disabled:opacity-50"
            >
              Publish Log
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
                    <Icon icon={mockTools.find((t) => t.slug === selectedTool)?.icon || ""} width={14} height={14} style={{ color: mockTools.find((t)=> t.slug===selectedTool)?.color }} />
                  </div>
                  <span>{mockTools.find((t) => t.slug === selectedTool)?.name}</span>
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
  );
}

function TagAdder({ onAdd }: { onAdd: (t: string) => void }) {
  const [val, setVal] = useState("");
  return (
    <div className="flex items-center gap-2">
      <input
        value={val}
        onChange={(e)=> setVal(e.target.value)}
        placeholder="Add tag"
        className="w-28 rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-xs outline-none focus:ring-2"
        style={{ outlineColor: "var(--ring)" }}
      />
      <button onClick={()=> { if(val.trim()) { onAdd(val.trim()); setVal(""); } }} className="text-xs text-[var(--text-muted)] hover:text-[var(--text)]">+ Add</button>
    </div>
  );
}


