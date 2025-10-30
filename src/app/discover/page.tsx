import { mockTools, mockLogs } from "@/lib/mock-data";
import Link from "next/link";
import { Icon } from "@iconify/react";

export default function DiscoverPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Discover</h1>
        <div className="flex gap-2 text-sm">
          <button className="rounded-lg border border-[var(--border)] px-3 py-1.5">All</button>
          <button className="rounded-lg border border-[var(--border)] px-3 py-1.5">Frontend</button>
          <button className="rounded-lg border border-[var(--border)] px-3 py-1.5">Backend</button>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm uppercase tracking-wide text-[var(--text-muted)]">Trending Tools</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {mockTools.map((t) => (
            <Link key={t.slug} href={`/${t.slug}`} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:bg-white/5">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg)]">
                <Icon icon={t.icon} width={20} height={20} />
              </div>
              <div className="text-sm">{t.name}</div>
              <div className="text-xs text-[var(--text-muted)]">{t.avgRating.toFixed(1)} · {t.usedByCount.toLocaleString()}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm uppercase tracking-wide text-[var(--text-muted)]">New Logs This Week</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {mockLogs.map((l) => (
            <Link key={l.id} href={`/logs/${l.id}`} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:bg-white/5">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-[var(--bg)]">
                  <Icon icon={l.tool.icon} width={16} height={16} />
                </div>
                <div className="flex-1">
                  <div className="text-[var(--text)]">{l.tool.name}</div>
                  <div className="text-[var(--text-muted)]">{l.review.slice(0, 80)}…</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}


