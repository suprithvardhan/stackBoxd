"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

function getToolColor(tools: any[], icon: string) {
  return tools.find((t) => t.icon === icon)?.color || undefined;
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

const navTabs = [
  { key: "activity", label: "Activity" },
  { key: "diary", label: "Diary" },
  { key: "reviews", label: "Reviews" },
  { key: "lists", label: "Lists" },
  { key: "likes", label: "Likes" },
];

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const { data: session } = useSession();
  const [tab, setTab] = useState("activity");
  const [user, setUser] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [lists, setLists] = useState<any[]>([]);
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userData, logsData, projectsData, listsData, toolsData] = await Promise.all([
          api.users.get(username),
          api.logs.list({ username, limit: 100 }),
          api.projects.list({ username, limit: 100 }),
          api.lists.list({ username, limit: 100 }),
          api.tools.list({ limit: 200 }),
        ]);
        setUser(userData);
        setLogs(logsData);
        setProjects(projectsData);
        setLists(listsData);
        setTools(toolsData);
      } catch (error) {
        console.error("Failed to load profile data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (username) {
      loadData();
    }
  }, [username]);

  const likedTools = Array.from(new Set(
    logs.filter((l) => l.rating === 5).map((l) => l.tool.slug)
  ));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[var(--text-muted)]">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[var(--text-muted)]">User not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Banner hero */}
      <section className="relative h-48 md:h-60 w-full rounded-3xl mb-2 border border-[var(--border)] overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-[#00FF8F10] shadow-lg flex flex-col justify-end">
        <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="relative flex flex-col md:flex-row items-end md:items-center gap-5 px-8 pb-5 z-2">
          <img src={user.avatarUrl || "/default-avatar.png"} alt={user.username} width={92} height={92} className="rounded-full border-4 border-[var(--primary)] shadow-xl bg-[var(--surface)] -mb-8 md:mb-0" />
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold text-white drop-shadow">{user.displayName} <span className="text-[var(--primary)]">@{user.username}</span></h1>
            <div className="mt-1 text-[var(--text-muted)] font-serif max-w-md">{user.bio || "No bio yet."}</div>
          </div>
          <div className="flex flex-col md:items-end md:justify-end items-start gap-1 ml-auto min-w-[110px]">
            <div className="text-sm text-[var(--text-muted)]">
              <span className="font-semibold text-[var(--primary)]">{user.stats?.toolsLogged || 0}</span> tools |&nbsp;
              <span className="font-semibold text-[var(--primary)]">{user.stats?.projects || 0}</span> projects |&nbsp;
              <span className="font-semibold text-[var(--primary)]">{user.stats?.followers || 0}</span> followers
            </div>
            <div className="flex gap-2 mt-2">
              <Link href="/stack-card" className="rounded-full bg-[var(--primary)] px-4 py-1.5 text-sm font-bold text-black focus:outline-none shadow-md">Share Card</Link>
              {session?.user?.id !== user.id && (
                <button className="rounded-full border border-[var(--primary)] px-4 py-1.5 text-sm font-bold text-[var(--primary)] bg-transparent">Follow</button>
              )}
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
            {logs.length === 0 ? (
              <div className="text-center py-12 text-[var(--text-muted)]">
                <p>No activity yet.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-4">
                {logs.slice(0, 6).map((l: any) => {
                  const tColor = getToolColor(tools, l.tool.icon);
                  return (
                    <div key={l.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col p-4 w-64 shadow hover:bg-white/5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)]" style={{ background: (tColor || '#888') + '10' }}>
                          <Icon icon={l.tool.icon} width={20} height={20} style={{ color: tColor }} />
                        </span>
                        <div className="flex-1">
                          <div className="text-[var(--text)] text-sm">Logged <span className="font-semibold">{l.tool.name}</span></div>
                          <div className="text-xs text-[var(--text-muted)]">{shortAgo(l.createdAt)}</div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-[var(--text-muted)] italic line-clamp-2">"{l.review}"</div>
                      <Link href={`/logs/${l.id}`} className="mt-3 text-xs text-[var(--primary)] hover:underline">View Log</Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        {tab === "diary" && (
          <div className="space-y-4">
            <h2 className="mb-3 text-lg font-semibold">Diary</h2>
            {logs.length === 0 ? (
              <div className="text-center py-12 text-[var(--text-muted)]">
                <p>No logs yet.</p>
              </div>
            ) : (
              <div className="rounded-xl border border-[var(--border)] overflow-hidden">
                <div className="hidden md:grid grid-cols-[72px_56px_56px_1fr_120px_72px] items-center px-4 py-2 text-xs uppercase tracking-wide text-[var(--text-muted)] border-b border-[var(--border)] bg-[var(--surface)]/60">
                  <div>Month</div>
                  <div className="text-center">Day</div>
                  <div></div>
                  <div>Tool</div>
                  <div className="text-center">Rating</div>
                  <div className="text-center">Actions</div>
                </div>
                <div>
                  {logs
                    .slice()
                    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((l: any, idx: number, arr: any[]) => {
                      const d = new Date(l.createdAt);
                      const monthKey = d.toLocaleString(undefined, { month: 'short', year: 'numeric' });
                      const prevMonthKey = idx > 0 ? new Date(arr[idx-1].createdAt).toLocaleString(undefined, { month: 'short', year: 'numeric' }) : null;
                      const isNewMonth = monthKey !== prevMonthKey;
                      const tColor = getToolColor(tools, l.tool.icon);
                      return (
                        <div key={l.id} className="grid grid-cols-[72px_56px_56px_1fr_120px_72px] items-center px-3 md:px-4 py-3 border-b border-[var(--border)] hover:bg-white/5 transition">
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
                          <div className="text-center text-sm text-[var(--text-muted)]">{d.getDate().toString().padStart(2,'0')}</div>
                          <div className="flex items-center justify-center">
                            <span className="h-10 w-10 rounded bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center" style={{ background: (tColor||'#888') + '10' }}>
                              <Icon icon={l.tool.icon} width={18} height={18} style={{ color: tColor }} />
                            </span>
                          </div>
                          <div className="min-w-0 flex items-center gap-2">
                            <Link href={`/tools/${l.tool.slug}`} className="font-medium text-[var(--text)] truncate hover:underline" style={{ color: tColor }}>{l.tool.name}</Link>
                            <span className="text-xs text-[var(--text-muted)] truncate">· {new Date(l.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div className="flex items-center justify-center text-[var(--accent)] text-sm">{starRow(l.rating)}</div>
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
            )}
          </div>
        )}
        {tab === "reviews" && (
          <div className="space-y-4">
            <h2 className="mb-3 text-lg font-semibold">Reviews</h2>
            {logs.length === 0 ? (
              <div className="text-center py-12 text-[var(--text-muted)]">
                <p>No reviews yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {logs.map((l: any) => {
                  const tColor = getToolColor(tools, l.tool.icon);
                  return (
                    <Link key={l.id} href={`/logs/${l.id}`} className="block rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:bg-white/5 shadow flex flex-col gap-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)]" style={{ background: `${tColor||'#737'}11` }}>
                          <Icon icon={l.tool.icon} width={20} height={20} style={{ color: tColor }} />
                        </span>
                        <span className="text-sm font-semibold text-[var(--text)]">{l.tool.name}</span>
                        <span className="ml-2 text-xs text-[var(--text-muted)]">{starRow(l.rating)}</span>
                      </div>
                      <div className="text-sm text-[var(--text-muted)] line-clamp-3">{l.review}</div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
        {tab === "lists" && (
          <div className="space-y-4">
            <h2 className="mb-3 text-lg font-semibold">Lists</h2>
            {lists.length === 0 ? (
              <div className="text-center py-12 text-[var(--text-muted)]">
                <p>No lists yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {lists.map((lst) => (
                  <Link key={lst.id} href={`/lists/${lst.id}`} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 flex flex-col gap-2 shadow-md hover:bg-white/5">
                    {lst.cover && (
                      <div className="aspect-[3/1.2] rounded-lg overflow-hidden mb-2 border border-[var(--border)] bg-center bg-cover" style={{ backgroundImage: `url(${lst.cover})` }} />
                    )}
                    <div className="font-semibold text-md">{lst.title}</div>
                    {lst.description && (
                      <div className="text-sm text-[var(--text-muted)] line-clamp-2">{lst.description}</div>
                    )}
                    <div className="flex gap-2 flex-wrap mt-1">
                      {lst.tools?.slice(0, 5).map((slug: string) => {
                        const t = tools.find(t => t.slug === slug);
                        if (!t) return null;
                        return <Icon icon={t.icon} width={24} height={24} key={slug} style={{ color: t.color }} />;
                      })}
                    </div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">{lst.count} tools</div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
        {tab === "likes" && (
          <div className="space-y-4">
            <h2 className="mb-3 text-lg font-semibold">Liked Tools</h2>
            {likedTools.length === 0 ? (
              <div className="text-center py-12 text-[var(--text-muted)]">
                <p>No liked tools yet.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-4">
                {likedTools.map(slug => {
                  const t = tools.find(t => t.slug === slug);
                  if (!t) return null;
                  return (
                    <Link key={slug} href={`/tools/${slug}`} className="flex flex-col items-center w-32 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:bg-white/5 shadow group">
                      <div className="rounded-md p-3 mb-2 border border-[var(--border)]" style={{ background: t.color+"10" }}>
                        <Icon icon={t.icon} width={32} height={32} style={{ color: t.color }} />
                      </div>
                      <span className="font-semibold text-[var(--text)] text-sm group-hover:text-[var(--primary)]">{t.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
