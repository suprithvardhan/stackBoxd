import Link from "next/link";
import { mockProjects, mockTools } from "@/lib/mock-data";
import { Icon } from "@iconify/react";

export default function ProjectsIndex() {
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight">Projects</h1>
        <div className="text-sm text-[var(--text-muted)]">{mockProjects.length} showcased</div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockProjects.map((p) => (
          <Link
            key={p.id}
            href={`/projects/${p.id}`}
            className="group rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow hover:shadow-xl transition"
          >
            <div
              className="h-40 w-full bg-center bg-cover relative"
              style={{ backgroundImage: `url(${p.coverImage})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-2 left-3 right-3">
                <div className="text-white font-bold text-lg drop-shadow">{p.displayName || p.name}</div>
                {p.tagline && (
                  <div className="text-zinc-200/85 text-xs italic line-clamp-1">{p.tagline}</div>
                )}
              </div>
            </div>

            <div className="p-4">
              {p.highlights && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {p.highlights.slice(0, 3).map((h) => (
                    <span key={h} className="px-2 py-0.5 rounded-full bg-[var(--bg)] border border-[var(--border)] text-[var(--primary)] text-xs font-bold">
                      {h}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                {p.tools.slice(0, 3).map((i) => {
                  const t = mockTools.find((mt) => mt.icon === i);
                  if (!t) return null;
                  return (
                    <span key={i} className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border)]" style={{ background: (t.color || '#999') + '12' }}>
                      <Icon icon={t.icon} width={18} height={18} style={{ color: t.color }} />
                    </span>
                  );
                })}
                <span className="ml-auto text-xs text-[var(--text-muted)]">★ {p.stars}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}


