"use client";
import { useState } from "react";
import { mockUser, mockLogs, mockProjects, mockTools } from "@/lib/mock-data";
import Link from "next/link";
import { Icon } from "@iconify/react";

function getToolColor(icon: string) {
  return mockTools.find((t) => t.icon === icon)?.color || undefined;
}

function getLogToolColor(log: any) {
  return getToolColor(log.tool.icon);
}

// profile mock lists
const mockLists = [
  {
    id: "lst_01",
    title: "My Top Dev Tools",
    cover: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&fit=crop",
    tools: ["nextjs", "typescript", "react", "fastapi", "tailwindcss"],
    count: 5
  },
  {
    id: "lst_02",
    title: "Go-To Backend Stack",
    cover: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=800&fit=crop",
    tools: ["golang", "redis", "postgresql", "docker"],
    count: 4
  }
];

const navTabs = [
  { key: "activity", label: "Activity" },
  { key: "diary", label: "Diary" },
  { key: "reviews", label: "Reviews" },
  { key: "lists", label: "Lists" },
  { key: "likes", label: "Likes" },
];

type Params = { params: { username: string } };

export default function ProfilePage({ params }: Params) {
  const [tab, setTab] = useState("activity");
  const user = mockUser; // For demo, always mockUser
  const logs = mockLogs.filter((l) => l.user === user.username);
  const projects = mockProjects.filter((p) => p.author === user.username);
  const langs = user.languages;
  const likedTools = Array.from(new Set(
    logs.filter((l) => l.rating === 5).map((l) => l.tool.slug)
  ));
  // Group logs by date for Diary
  const diaryEntries = Array.from(
    logs.reduce((map, log) => {
      const date = log.createdAt.slice(0,10);
      if (!map.has(date)) map.set(date, []);
      map.get(date).push(log);
      return map;
    }, new Map()),
    ([date, logs]) => ({ date, logs })
  ).sort((a, b) => b.date.localeCompare(a.date));

  // Banner section
  return (
    <div className="space-y-10">
      {/* Banner hero */}
      <section className="relative h-48 md:h-60 w-full rounded-3xl mb-2 border border-[var(--border)] overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-[#00FF8F10] shadow-lg flex flex-col justify-end">
        <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="relative flex flex-col md:flex-row items-end md:items-center gap-5 px-8 pb-5 z-2">
          <img src={user.avatarUrl} alt={user.username} width={92} height={92} className="rounded-full border-4 border-[var(--primary)] shadow-xl bg-[var(--surface)] -mb-8 md:mb-0" />
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold text-white drop-shadow">{user.displayName} <span className="text-[var(--primary)]">@{user.username}</span></h1>
            <div className="mt-1 text-[var(--text-muted)] font-serif max-w-md">{user.bio}</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {langs.map((lang) => (
                <span key={lang} className="rounded-full bg-[var(--surface)] border border-[var(--border)] px-3 py-1 text-xs font-medium shadow-sm tracking-tight" style={{ color: mockTools.find(t => t.name.toLowerCase().includes(lang.toLowerCase()))?.color }}>{lang}</span>
              ))}
            </div>
          </div>
          <div className="flex flex-col md:items-end md:justify-end items-start gap-1 ml-auto min-w-[110px]">
            <div className="text-sm text-[var(--text-muted)]">
              <span className="font-semibold text-[var(--primary)]">{user.stats.toolsLogged}</span> tools |&nbsp;
              <span className="font-semibold text-[var(--primary)]">{user.stats.projects}</span> projects |&nbsp;
              <span className="font-semibold text-[var(--primary)]">{user.stats.followers}</span> followers
            </div>
            <div className="flex gap-2 mt-2">
              <Link href="/stack-card" className="rounded-full bg-[var(--primary)] px-4 py-1.5 text-sm font-bold text-black focus:outline-none shadow-md">Share Card</Link>
              <button className="rounded-full border border-[var(--primary)] px-4 py-1.5 text-sm font-bold text-[var(--primary)] bg-transparent">Follow</button>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Tabs */}
      <nav className="flex gap-1 md:gap-4 px-2 md:px-0 border-b border-[var(--border)] sticky top-0 z-10 bg-[var(--bg)]/80 backdrop-blur">
        {navTabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`px-3 py-2 text-sm font-semibold rounded-t text-[var(--text)] border-b-2 transition-all ${tab === t.key ? 'border-[var(--primary)] text-[var(--primary)] bg-white/5' : 'border-transparent hover:text-[var(--primary)]'}`}>{t.label}</button>
        ))}
      </nav>

      {/* Tab Content */}
      <div>
        {tab === "activity" && (
          <div className="space-y-6">
            <h2 className="mb-3 text-lg font-semibold">Activity</h2>
            <div className="flex flex-wrap gap-4">
              {logs.slice(0, 6).map((l: any, idx) => (
                <div key={l.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col p-4 w-64 shadow hover:bg-white/5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)]" style={{ background: getToolColor(l.tool.icon) + '10' }}>
                      <Icon icon={l.tool.icon} width={20} height={20} style={{ color: getToolColor(l.tool.icon) }} />
                    </span>
                    <div className="flex-1">
                      <div className="text-[var(--text)] text-sm">Logged <span className="font-semibold">{l.tool.name}</span></div>
                      <div className="text-xs text-[var(--text-muted)]">{shortAgo(l.createdAt)}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-[var(--text-muted)] italic line-clamp-2">"{l.review}"</div>
                  <Link href={`/logs/${l.id}`} className="mt-3 text-xs text-[var(--primary)] hover:underline">View Log</Link>
                </div>
              ))}
              {/* Add more card types for different activity if needed */}
            </div>
          </div>
        )}
        {tab === "diary" && (
          <div className="space-y-4">
            <h2 className="mb-3 text-lg font-semibold">Diary</h2>
            <div className="rounded-xl border border-[var(--border)] overflow-hidden">
              {/* header row */}
              <div className="hidden md:grid grid-cols-[72px_56px_56px_1fr_120px_72px] items-center px-4 py-2 text-xs uppercase tracking-wide text-[var(--text-muted)] border-b border-[var(--border)] bg-[var(--surface)]/60">
                <div>Month</div>
                <div className="text-center">Day</div>
                <div></div>
                <div>Tool</div>
                <div className="text-center">Rating</div>
                <div className="text-center">Actions</div>
              </div>
              {/* rows */}
              <div>
                {logs
                  .slice()
                  .sort((a: any, b: any) => b.createdAt.localeCompare(a.createdAt))
                  .map((l: any, idx: number, arr: any[]) => {
                    const d = new Date(l.createdAt);
                    const monthKey = d.toLocaleString(undefined, { month: 'short', year: 'numeric' });
                    const prevMonthKey = idx > 0 ? new Date(arr[idx-1].createdAt).toLocaleString(undefined, { month: 'short', year: 'numeric' }) : null;
                    const isNewMonth = monthKey !== prevMonthKey;
                    const tColor = getToolColor(l.tool.icon);
                    return (
                      <div key={l.id} className="grid grid-cols-[72px_56px_56px_1fr_120px_72px] items-center px-3 md:px-4 py-3 border-b border-[var(--border)] hover:bg-white/5 transition">
                        {/* Month badge (only on first row of month) */}
                        <div className="text-xs font-semibold text-[var(--text-muted)]">
                          {isNewMonth ? (
                            <div className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-1">
                              <span className="rounded bg-[var(--surface)] px-1.5 py-0.5 text-[var(--text-muted)]">{d.toLocaleString(undefined, { month: 'short' }).toUpperCase()}</span>
                              <span className="text-[var(--text)]">{d.getFullYear()}</span>
                            </div>
                          ) : (
                            <span className="opacity-40">—</span>
                          )}
                        </div>
                        {/* Day number */}
                        <div className="text-center text-sm text-[var(--text-muted)]">{d.getDate().toString().padStart(2,'0')}</div>
                        {/* Thumb */}
                        <div className="flex items-center justify-center">
                          <span className="h-10 w-10 rounded bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center" style={{ background: (tColor||'#888') + '10' }}>
                            <Icon icon={l.tool.icon} width={18} height={18} style={{ color: tColor }} />
                          </span>
                        </div>
                        {/* Title/meta */}
                        <div className="min-w-0 flex items-center gap-2">
                          <Link href={`/${l.tool.slug}`} className="font-medium text-[var(--text)] truncate hover:underline" style={{ color: tColor }}>{l.tool.name}</Link>
                          <span className="text-xs text-[var(--text-muted)] truncate">· {new Date(l.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        {/* Rating */}
                        <div className="flex items-center justify-center text-[var(--accent)] text-sm">{starRow(l.rating)}</div>
                        {/* Actions */}
                        <div className="flex items-center justify-center gap-3 text-[var(--text-muted)]">
                          <Icon icon="mdi:heart-outline" width={16} height={16} />
                          <Icon icon="mdi:pencil-outline" width={16} height={16} />
                          <Link href={`/logs/${l.id}`}><Icon icon="lucide:more-horizontal" width={16} height={16} /></Link>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
        {tab === "reviews" && (
          <div className="space-y-4">
            <h2 className="mb-3 text-lg font-semibold">Reviews</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {logs.map((l: any) => (
                <Link key={l.id} href={`/logs/${l.id}`} className="block rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:bg-white/5 shadow flex flex-col gap-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)]" style={{ background: `${getToolColor(l.tool.icon)||'#737'}11` }}>
                      <Icon icon={l.tool.icon} width={20} height={20} style={{ color: getToolColor(l.tool.icon) }} />
                    </span>
                    <span className="text-sm font-semibold text-[var(--text)]">{l.tool.name}</span>
                    <span className="ml-2 text-xs text-[var(--text-muted)]">{starRow(l.rating)}</span>
                  </div>
                  <div className="text-sm text-[var(--text-muted)] line-clamp-3">{l.review}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
        {tab === "lists" && (
          <div className="space-y-4">
            <h2 className="mb-3 text-lg font-semibold">Lists</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {mockLists.map((lst) => (
                <div key={lst.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 flex flex-col gap-2 shadow-md hover:bg-white/5">
                  <div className="aspect-[3/1.2] rounded-lg overflow-hidden mb-2 border border-[var(--border)] bg-center bg-cover" style={{ backgroundImage: `url(${lst.cover})` }} />
                  <div className="font-semibold text-md">{lst.title}</div>
                  <div className="flex gap-2 flex-wrap mt-1">
                    {lst.tools.map((slug) => {
                      const t = mockTools.find(t=>t.slug===slug);
                      if (!t) return null;
                      return <Icon icon={t.icon} width={24} height={24} key={slug} style={{ color: t.color }} />;
                    })}
                  </div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">{lst.count} tools</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === "likes" && (
          <div className="space-y-4">
            <h2 className="mb-3 text-lg font-semibold">Liked Tools</h2>
            <div className="flex flex-wrap gap-4">
              {likedTools.map(slug => {
                const t = mockTools.find(t=>t.slug===slug);
                if (!t) return null;
                return (
                  <Link key={slug} href={`/${slug}`} className="flex flex-col items-center w-32 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:bg-white/5 shadow group">
                    <div className="rounded-md p-3 mb-2 border border-[var(--border)]" style={{ background: t.color+"10" }}>
                      <Icon icon={t.icon} width={32} height={32} style={{ color: t.color }} />
                    </div>
                    <span className="font-semibold text-[var(--text)] text-sm group-hover:text-[var(--primary)]">{t.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Old Logs/Projects Grid - now redundant but kept for fallback/testing */}
    </div>
  );
}

function starRow(n: number) {
  return Array.from({ length: n }).map((_, i) => (
    <span key={i} className="text-[var(--accent)]">★</span>
  ));
}

function shortAgo(date: string) {
  const d = new Date(date);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60 * 60) return `${Math.round(diff / 60)}m ago`;
  if (diff < 48 * 3600) return `${Math.round(diff / 3600)}h ago`;
  return `${Math.round(diff / 86400)}d ago`;
}


