"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useFollowStatus, useToggleFollow, useFollowers, useFollowing, useUser, useLogs, useProjects, useLists, useTools } from "@/lib/api-hooks";

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
  const [logs, setLogs] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [lists, setLists] = useState<any[]>([]);
  const [tools, setTools] = useState<any[]>([]);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  
  // Use React Query hook for user data - ensures proper cache invalidation
  const { data: user, isLoading: userLoading, refetch: refetchUser } = useUser(username, !!username);
  
  // Follow functionality - only check if viewing other user's profile
  const { data: followStatus } = useFollowStatus(
    user?.id || "", 
    !!user?.id && !!session?.user?.id && session?.user?.id !== user?.id
  );
  const toggleFollow = useToggleFollow();
  
  const isFollowing = followStatus?.following || false;

  // OPTIMIZED: Use React Query hooks for caching instead of direct API calls
  const { data: logsData = [], isLoading: logsLoading } = useLogs({ username, limit: 100 });
  const { data: projectsData = [], isLoading: projectsLoading } = useProjects({ username, limit: 100 });
  const { data: listsData = [], isLoading: listsLoading } = useLists({ username, limit: 100 });
  const { data: toolsData = [], isLoading: toolsLoading } = useTools({ limit: 200 });

  // Update state when data loads (for backward compatibility with existing code)
  useEffect(() => {
    if (logsData) setLogs(logsData);
    if (projectsData) setProjects(projectsData);
    if (listsData) setLists(listsData);
    if (toolsData) setTools(toolsData);
  }, [logsData, projectsData, listsData, toolsData]);

  // Optimistically update follower count when follow status changes
  useEffect(() => {
    if (user && followStatus?.following !== undefined) {
      // Immediately refetch user data to get updated follower count
      refetchUser();
    }
  }, [followStatus?.following, user?.id, refetchUser]);

  const likedTools = Array.from(new Set(
    logs.filter((l) => l.rating === 5).map((l) => l.tool.slug)
  ));

  const loading = userLoading;

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
    <div className="space-y-6 sm:space-y-8 md:space-y-10">
      {/* Banner hero */}
      <section className="relative h-40 sm:h-48 md:h-60 w-full rounded-2xl sm:rounded-3xl mb-2 border border-[var(--border)] overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-[#00FF8F10] shadow-lg flex flex-col justify-end">
        <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="relative flex flex-col md:flex-row items-end md:items-center gap-3 sm:gap-4 md:gap-5 px-4 sm:px-6 md:px-8 pb-3 sm:pb-4 md:pb-5 z-2">
          <img src={user.avatarUrl || "/default-avatar.png"} alt={user.username} width={92} height={92} className="rounded-full border-2 sm:border-4 border-[var(--primary)] shadow-xl bg-[var(--surface)] h-16 w-16 sm:h-20 sm:w-20 md:h-[92px] md:w-[92px] -mb-6 sm:-mb-8 md:mb-0 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white drop-shadow truncate">{user.displayName} <span className="text-[var(--primary)]">@{user.username}</span></h1>
            <div className="mt-1 text-xs sm:text-sm text-[var(--text-muted)] font-serif line-clamp-2">{user.bio || "No bio yet."}</div>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col md:items-end md:justify-end items-start gap-2 sm:gap-3 md:gap-1 ml-auto w-full sm:w-auto md:min-w-[110px]">
            <div className="text-xs sm:text-sm text-[var(--text-muted)] flex flex-wrap items-center gap-1 sm:gap-0">
              <span className="font-semibold text-[var(--primary)]">{user.stats?.toolsLogged || 0}</span> <span className="hidden sm:inline">tools</span> <span className="sm:inline">|</span>
              <span className="font-semibold text-[var(--primary)] ml-1 sm:ml-0">{user.stats?.projects || 0}</span> <span className="hidden sm:inline">projects</span> <span className="sm:inline">|</span>
              <button 
                onClick={() => setShowFollowersModal(true)}
                className="font-semibold text-[var(--primary)] hover:underline cursor-pointer ml-1 sm:ml-0"
              >
                {user.stats?.followers || 0} <span className="hidden sm:inline">followers</span>
              </button>
              {user.stats?.following !== undefined && (user.stats.following < 200) && (
                <>
                  <span className="sm:inline"> | </span>
                  <button 
                    onClick={() => setShowFollowingModal(true)}
                    className="font-semibold text-[var(--primary)] hover:underline cursor-pointer"
                  >
                    {user.stats.following} <span className="hidden sm:inline">following</span>
                  </button>
                </>
              )}
            </div>
            <div className="flex gap-2 sm:gap-2 mt-1 sm:mt-2 w-full sm:w-auto">
              <Link href="/stack-card" className="flex-1 sm:flex-none rounded-full bg-[var(--primary)] px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-bold text-black focus:outline-none shadow-md text-center min-h-[36px] sm:min-h-0 flex items-center justify-center">Share Card</Link>
              {session?.user?.id !== user.id && (
                <button 
                  onClick={() => {
                    if (user?.id && !toggleFollow.isPending) {
                      toggleFollow.mutate(user.id);
                    }
                  }}
                  disabled={toggleFollow.isPending}
                  className={`flex-1 sm:flex-none rounded-full border px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-bold transition min-h-[36px] sm:min-h-0 flex items-center justify-center ${
                    isFollowing
                      ? "border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--bg)]"
                      : "border-[var(--primary)] text-[var(--primary)] bg-transparent hover:bg-[var(--primary)]/10"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {toggleFollow.isPending ? "..." : isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Profile Tabs - Mobile: Horizontal scroll, Desktop: Full width */}
      <nav className="flex gap-0.5 sm:gap-1 md:gap-4 px-1 sm:px-2 md:px-0 border-b border-[var(--border)] sticky top-0 z-10 bg-[var(--bg)]/80 backdrop-blur overflow-x-auto -mx-1 sm:mx-0 scrollbar-hide">
        {navTabs.map(t => (
          <button 
            key={t.key} 
            onClick={() => setTab(t.key)} 
            className={`px-3 sm:px-4 md:px-3 py-2.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-t text-[var(--text)] border-b-2 transition-all whitespace-nowrap flex-shrink-0 min-h-[44px] sm:min-h-0 ${tab === t.key ? 'border-[var(--primary)] text-[var(--primary)] bg-white/5' : 'border-transparent hover:text-[var(--primary)]'}`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <div>
        {tab === "activity" && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="mb-2 sm:mb-3 text-base sm:text-lg font-semibold">Activity</h2>
            {logs.length === 0 ? (
              <div className="text-center py-8 sm:py-12 text-[var(--text-muted)] px-4">
                <p className="text-sm sm:text-base">No activity yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {logs.slice(0, 6).map((l: any) => {
                  const tColor = getToolColor(tools, l.tool.icon);
                  return (
                    <div key={l.id} className="rounded-lg sm:rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col p-3 sm:p-4 shadow hover:bg-white/5 w-full">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-[var(--border)] flex-shrink-0" style={{ background: (tColor || '#888') + '10' }}>
                          <Icon icon={l.tool.icon} width={18} height={18} className="sm:w-5 sm:h-5" style={{ color: tColor }} />
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-[var(--text)] text-xs sm:text-sm truncate">Logged <span className="font-semibold">{l.tool.name}</span></div>
                          <div className="text-[10px] sm:text-xs text-[var(--text-muted)]">{shortAgo(l.createdAt)}</div>
                        </div>
                      </div>
                      <div className="mt-2 text-[10px] sm:text-xs text-[var(--text-muted)] italic line-clamp-2 leading-relaxed">"{l.review}"</div>
                      <Link href={`/logs/${l.id}`} className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-[var(--primary)] hover:underline">View Log</Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        {tab === "diary" && (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="mb-2 sm:mb-3 text-base sm:text-lg font-semibold">Diary</h2>
            {logs.length === 0 ? (
              <div className="text-center py-8 sm:py-12 text-[var(--text-muted)] px-4">
                <p className="text-sm sm:text-base">No logs yet.</p>
              </div>
            ) : (
              <div className="rounded-lg sm:rounded-xl border border-[var(--border)] overflow-hidden">
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
                        <div key={l.id} className="md:grid md:grid-cols-[72px_56px_56px_1fr_120px_72px] md:items-center flex flex-col md:flex-row gap-2 md:gap-0 px-3 sm:px-4 py-3 border-b border-[var(--border)] hover:bg-white/5 transition">
                          <div className="text-xs font-semibold text-[var(--text-muted)] flex items-center gap-2 md:block">
                            {isNewMonth ? (
                              <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-1">
                                <span className="rounded bg-[var(--surface)] px-1.5 py-0.5 text-[10px] sm:text-xs text-[var(--text-muted)]">{d.toLocaleString(undefined, { month: 'short' }).toUpperCase()}</span>
                                <span className="text-xs sm:text-sm text-[var(--text)]">{d.getFullYear()}</span>
                              </div>
                            ) : (
                              <span className="opacity-40 hidden md:inline">—</span>
                            )}
                            <span className="md:hidden text-[var(--text-muted)]">{d.getDate().toString().padStart(2,'0')} {d.toLocaleString(undefined, { month: 'short' })}</span>
                          </div>
                          <div className="hidden md:block text-center text-sm text-[var(--text-muted)]">{d.getDate().toString().padStart(2,'0')}</div>
                          <div className="flex items-center justify-center">
                            <span className="h-8 w-8 sm:h-10 sm:w-10 rounded bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center flex-shrink-0" style={{ background: (tColor||'#888') + '10' }}>
                              <Icon icon={l.tool.icon} width={16} height={16} className="sm:w-[18px] sm:h-[18px]" style={{ color: tColor }} />
                            </span>
                          </div>
                          <div className="min-w-0 flex items-center gap-2 flex-1">
                            <Link href={`/tools/${l.tool.slug}`} className="font-medium text-xs sm:text-sm text-[var(--text)] truncate hover:underline" style={{ color: tColor }}>{l.tool.name}</Link>
                            <span className="text-[10px] sm:text-xs text-[var(--text-muted)] truncate hidden sm:inline">· {new Date(l.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div className="flex items-center justify-center text-[var(--accent)] text-xs sm:text-sm">{starRow(l.rating)}</div>
                          <div className="flex items-center justify-center gap-2 sm:gap-3 text-[var(--text-muted)]">
                            <Icon icon="mdi:heart-outline" width={14} height={14} className="sm:w-4 sm:h-4" />
                            <Icon icon="mdi:pencil-outline" width={14} height={14} className="sm:w-4 sm:h-4" />
                            <Link href={`/logs/${l.id}`}><Icon icon="lucide:more-horizontal" width={14} height={14} className="sm:w-4 sm:h-4" /></Link>
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
          <div className="space-y-3 sm:space-y-4">
            <h2 className="mb-2 sm:mb-3 text-base sm:text-lg font-semibold">Reviews</h2>
            {logs.length === 0 ? (
              <div className="text-center py-8 sm:py-12 text-[var(--text-muted)] px-4">
                <p className="text-sm sm:text-base">No reviews yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                {logs.map((l: any) => {
                  const tColor = getToolColor(tools, l.tool.icon);
                  return (
                    <Link key={l.id} href={`/logs/${l.id}`} className="block rounded-lg sm:rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4 hover:bg-white/5 shadow flex flex-col gap-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-[var(--border)] flex-shrink-0" style={{ background: `${tColor||'#737'}11` }}>
                          <Icon icon={l.tool.icon} width={18} height={18} className="sm:w-5 sm:h-5" style={{ color: tColor }} />
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-[var(--text)] truncate flex-1">{l.tool.name}</span>
                        <span className="ml-2 text-[10px] sm:text-xs text-[var(--text-muted)] flex-shrink-0">{starRow(l.rating)}</span>
                      </div>
                      <div className="text-xs sm:text-sm text-[var(--text-muted)] line-clamp-2 sm:line-clamp-3 leading-relaxed">{l.review}</div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
        {tab === "lists" && (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="mb-2 sm:mb-3 text-base sm:text-lg font-semibold">Lists</h2>
            {lists.length === 0 ? (
              <div className="text-center py-8 sm:py-12 text-[var(--text-muted)] px-4">
                <p className="text-sm sm:text-base">No lists yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
                {lists.map((lst) => (
                  <Link key={lst.id} href={`/lists/${lst.id}`} className="rounded-lg sm:rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 flex flex-col gap-2 shadow-md hover:bg-white/5">
                    {lst.cover && (
                      <div className="aspect-[3/1.2] rounded-lg overflow-hidden mb-2 border border-[var(--border)] bg-center bg-cover" style={{ backgroundImage: `url(${lst.cover})` }} />
                    )}
                    <div className="font-semibold text-sm sm:text-base truncate">{lst.title}</div>
                    {lst.description && (
                      <div className="text-xs sm:text-sm text-[var(--text-muted)] line-clamp-2 leading-relaxed">{lst.description}</div>
                    )}
                    <div className="flex gap-1.5 sm:gap-2 flex-wrap mt-1">
                      {lst.tools?.slice(0, 5).map((slug: string) => {
                        const t = tools.find(t => t.slug === slug);
                        if (!t) return null;
                        return <Icon icon={t.icon} width={20} height={20} className="sm:w-6 sm:h-6" key={slug} style={{ color: t.color }} />;
                      })}
                    </div>
                    <div className="text-[10px] sm:text-xs text-[var(--text-muted)] mt-1">{lst.count} tools</div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
        {tab === "likes" && (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="mb-2 sm:mb-3 text-base sm:text-lg font-semibold">Liked Tools</h2>
            {likedTools.length === 0 ? (
              <div className="text-center py-8 sm:py-12 text-[var(--text-muted)] px-4">
                <p className="text-sm sm:text-base">No liked tools yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
                {likedTools.map(slug => {
                  const t = tools.find(t => t.slug === slug);
                  if (!t) return null;
                  return (
                    <Link key={slug} href={`/tools/${slug}`} className="flex flex-col items-center rounded-lg sm:rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4 hover:bg-white/5 shadow group">
                      <div className="rounded-md p-2 sm:p-3 mb-2 border border-[var(--border)] flex-shrink-0" style={{ background: t.color+"10" }}>
                        <Icon icon={t.icon} width={24} height={24} className="sm:w-8 sm:h-8" style={{ color: t.color }} />
                      </div>
                      <span className="font-semibold text-[var(--text)] text-xs sm:text-sm text-center group-hover:text-[var(--primary)] truncate w-full">{t.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Followers Modal */}
      {showFollowersModal && (
        <FollowersModal 
          userId={user.id} 
          onClose={() => setShowFollowersModal(false)} 
        />
      )}

      {/* Following Modal */}
      {showFollowingModal && (
        <FollowingModal 
          userId={user.id} 
          onClose={() => setShowFollowingModal(false)} 
        />
      )}
    </div>
  );
}

function FollowersModal({ userId, onClose }: { userId: string; onClose: () => void }) {
  const { data: followers = [], isLoading } = useFollowers(userId);
  
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
            <h2 className="text-xl font-bold">Followers</h2>
            <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text)]">
              <Icon icon="mdi:close" width={24} height={24} />
            </button>
          </div>
          <div className="overflow-y-auto p-6">
            {isLoading ? (
              <div className="text-center py-8 text-[var(--text-muted)]">Loading...</div>
            ) : followers.length === 0 ? (
              <div className="text-center py-8 text-[var(--text-muted)]">No followers yet.</div>
            ) : (
              <div className="space-y-4">
                {followers.map((user: any) => (
                  <Link
                    key={user.id}
                    href={`/profile/${user.username}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-[var(--bg)] transition"
                  >
                    <img
                      src={user.avatarUrl || "/default-avatar.png"}
                      alt={user.username}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-[var(--text)]">{user.displayName}</div>
                      <div className="text-sm text-[var(--text-muted)]">@{user.username}</div>
                      {user.bio && (
                        <div className="text-sm text-[var(--text-muted)] mt-1 line-clamp-1">{user.bio}</div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function FollowingModal({ userId, onClose }: { userId: string; onClose: () => void }) {
  const { data: following = [], isLoading } = useFollowing(userId);
  
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
            <h2 className="text-xl font-bold">Following</h2>
            <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text)]">
              <Icon icon="mdi:close" width={24} height={24} />
            </button>
          </div>
          <div className="overflow-y-auto p-6">
            {isLoading ? (
              <div className="text-center py-8 text-[var(--text-muted)]">Loading...</div>
            ) : following.length === 0 ? (
              <div className="text-center py-8 text-[var(--text-muted)]">Not following anyone yet.</div>
            ) : (
              <div className="space-y-4">
                {following.map((user: any) => (
                  <Link
                    key={user.id}
                    href={`/profile/${user.username}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-[var(--bg)] transition"
                  >
                    <img
                      src={user.avatarUrl || "/default-avatar.png"}
                      alt={user.username}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-[var(--text)]">{user.displayName}</div>
                      <div className="text-sm text-[var(--text-muted)]">@{user.username}</div>
                      {user.bio && (
                        <div className="text-sm text-[var(--text-muted)] mt-1 line-clamp-1">{user.bio}</div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
