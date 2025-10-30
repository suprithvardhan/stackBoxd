import { FeedCardLog } from "@/components/feed-card-log";
import { mockLogs, mockProjects, mockTools } from "@/lib/mock-data";
import { Icon } from "@iconify/react";
import Link from "next/link";

function getColorByIcon(icon: string) {
  return mockTools.find((t) => t.icon === icon)?.color || undefined;
}

export default function FeedPage() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
      <section className="md:col-span-8 space-y-4">
        <h2 className="mb-2 text-sm uppercase tracking-wide text-[var(--text-muted)]">From people you follow</h2>
        {mockLogs.map((item) => (
          <FeedCardLog key={item.id} item={item} />
        ))}
      </section>
      <aside className="md:col-span-4 space-y-6">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <h3 className="mb-3 text-sm uppercase tracking-wide text-[var(--text-muted)]">Trending Tools</h3>
          <ul className="space-y-3">
            {mockTools.slice(0, 6).map((t) => (
              <li key={t.slug} className="flex items-center justify-between">
                <Link href={`/${t.slug}`} className="flex items-center gap-3 hover:underline">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg)]" style={{ background: t.color + '12' }}>
                    <Icon icon={t.icon} width={22} height={22} style={{ color: t.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: t.slug === 'nextjs' ? '#E0E0E0' : t.color }}>{t.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{t.avgRating.toFixed(1)} · Used by {t.usedByCount.toLocaleString()}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <h3 className="mb-3 text-sm uppercase tracking-wide text-[var(--text-muted)]">Recently Logged Projects</h3>
          <ul className="space-y-3">
            {mockProjects.map((p) => (
              <li key={p.id} className="flex items-center gap-3">
                <div className="h-10 w-16 overflow-hidden rounded-md border border-[var(--border)] bg-[var(--bg)]" style={{backgroundImage:`url(${p.coverImage})`, backgroundSize:'cover'}} />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{p.name}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    {p.tools.slice(0, 3).map((i) => (
                      <Icon key={i} icon={i} width={16} height={16} style={{ color: getColorByIcon(i) }} />
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}


