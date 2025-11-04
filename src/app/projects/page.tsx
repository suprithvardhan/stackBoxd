"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";

// Loading skeleton component
function ProjectCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] animate-pulse">
      <div className="h-40 w-full bg-[var(--bg)]" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-[var(--bg)] rounded w-3/4" />
        <div className="h-3 bg-[var(--bg)] rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-[var(--bg)] rounded-md" />
          <div className="h-8 w-8 bg-[var(--bg)] rounded-md" />
          <div className="h-8 w-8 bg-[var(--bg)] rounded-md ml-auto" />
        </div>
      </div>
    </div>
  );
}

// Toast notification component
function Toast({ message, type = "success", onClose }: { message: string; type?: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border ${
      type === "success" 
        ? "bg-green-900/20 border-green-500/50 text-green-400" 
        : "bg-red-900/20 border-red-500/50 text-red-400"
    } animate-in slide-in-from-right-5`}>
      <div className="flex items-center gap-2">
        <Icon icon={type === "success" ? "mdi:check-circle" : "mdi:alert-circle"} width={20} height={20} />
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-[var(--text-muted)] hover:text-[var(--text)]"
        >
          <Icon icon="mdi:close" width={16} height={16} />
        </button>
      </div>
    </div>
  );
}

export default function ProjectsIndex() {
  const { data: session } = useSession();
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [activeSection, setActiveSection] = useState<"your" | "all">("all");

  // Update active section when session changes
  useEffect(() => {
    if (session?.user?.id) {
      // If user logs in and is currently on "all", switch to "your"
      if (activeSection === "all") {
        setActiveSection("your");
      }
    } else {
      // If user logs out and is on "your", switch to "all"
      if (activeSection === "your") {
        setActiveSection("all");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const loadPromises: Promise<any>[] = [
          api.tools.list({ limit: 200 }),
          api.projects.list({ limit: 50 }), // All projects
        ];
        
        // Load user projects if logged in
        if (session?.user?.id) {
          loadPromises.push(api.projects.list({ authorId: session.user.id, limit: 50 }));
        }
        
        const results = await Promise.all(loadPromises);
        setTools(results[0]);
        setAllProjects(results[1]);
        
        // Set user projects if logged in
        if (session?.user?.id && results[2]) {
          setUserProjects(results[2]);
        }
      } catch (error) {
        console.error("Failed to load projects:", error);
        setToast({ message: "Failed to load projects", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [session?.user?.id]);

  function getTool(icon: string) {
    return tools.find((t) => t.icon === icon);
  }

  const handleSyncGitHub = async () => {
    if (!session?.user?.id) return;
    setSyncing(true);
    try {
      const result = await api.github.sync();
      if (result.success) {
        // Reload user projects and all projects
        const [userProjectsData, allProjectsData] = await Promise.all([
          api.projects.list({ authorId: session.user.id, limit: 50 }),
          api.projects.list({ limit: 50 }),
        ]);
        setUserProjects(userProjectsData);
        setAllProjects(allProjectsData);
        setToast({ 
          message: `Successfully synced ${result.synced} projects from GitHub!`, 
          type: "success" 
        });
      }
    } catch (error) {
      console.error("Failed to sync GitHub:", error);
      setToast({ 
        message: "Failed to sync GitHub repos. Make sure you're logged in with GitHub.", 
        type: "error" 
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <>
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      
      <div className="space-y-4 sm:space-y-6 md:space-y-8">
        {/* Section Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Projects</h1>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {session && (
              <button
                onClick={handleSyncGitHub}
                disabled={syncing}
                className="flex-1 sm:flex-none rounded-full border border-[var(--border)] px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium hover:bg-white/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[44px] sm:min-h-0"
              >
                {syncing ? (
                  <>
                    <Icon icon="mdi:loading" className="animate-spin" width={14} height={14} className="sm:w-4 sm:h-4" />
                    <span>Syncing...</span>
                  </>
                ) : (
                  <>
                    <Icon icon="mdi:github" width={14} height={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Sync from GitHub</span>
                    <span className="sm:hidden">Sync</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 border-b border-[var(--border)] overflow-x-auto -mx-1 px-1 sm:mx-0 sm:px-0">
          {session && (
            <button
              onClick={() => setActiveSection("your")}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors border-b-2 whitespace-nowrap flex-shrink-0 min-h-[44px] sm:min-h-0 ${
                activeSection === "your"
                  ? "border-[var(--primary)] text-[var(--primary)]"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              Your Projects
              {!loading && userProjects.length > 0 && (
                <span className="ml-1.5 sm:ml-2 px-1 sm:px-1.5 py-0.5 text-[10px] sm:text-xs rounded-full bg-[var(--bg)] border border-[var(--border)]">
                  {userProjects.length}
                </span>
              )}
            </button>
          )}
          <button
            onClick={() => setActiveSection("all")}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors border-b-2 whitespace-nowrap flex-shrink-0 min-h-[44px] sm:min-h-0 ${
              activeSection === "all"
                ? "border-[var(--primary)] text-[var(--primary)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            All Projects
            {!loading && allProjects.length > 0 && (
              <span className="ml-1.5 sm:ml-2 px-1 sm:px-1.5 py-0.5 text-[10px] sm:text-xs rounded-full bg-[var(--bg)] border border-[var(--border)]">
                {allProjects.length}
              </span>
            )}
          </button>
        </div>

        {/* Your Projects Section */}
        {activeSection === "your" && session && (
          <section className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">Your Projects</h2>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">Projects you've created or synced</p>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <ProjectCardSkeleton key={i} />
                ))}
              </div>
            ) : userProjects.length === 0 ? (
              <div className="text-center py-12 sm:py-16 text-[var(--text-muted)] border border-[var(--border)] rounded-xl bg-[var(--surface)] px-4">
                <Icon icon="mdi:folder-outline" width={48} height={48} className="sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 opacity-50" />
                <p className="text-base sm:text-lg font-semibold mb-2">No projects yet</p>
                <p className="text-xs sm:text-sm mb-4">Get started by creating or syncing your first project</p>
                <Link 
                  href="/projects/new" 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)] text-black text-sm sm:text-base font-medium hover:bg-[var(--primary)]/90 transition-colors min-h-[44px]"
                >
                  <Icon icon="mdi:plus" width={16} height={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span>Create your first project</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {userProjects.map((p) => (
                  <Link
                    key={p.id}
                    href={`/projects/${p.id}`}
                    className="group rounded-xl sm:rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {p.coverImage ? (
                      <div
                        className="h-32 sm:h-40 w-full bg-center bg-cover relative transition-transform duration-300 group-hover:scale-105"
                        style={{ backgroundImage: `url(${p.coverImage})` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2 sm:left-3 sm:right-3">
                          <div className="text-white font-bold text-sm sm:text-lg drop-shadow truncate">{p.displayName || p.name}</div>
                          {p.tagline && (
                            <div className="text-zinc-200/85 text-[10px] sm:text-xs italic line-clamp-1">{p.tagline}</div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="h-32 sm:h-40 w-full bg-gradient-to-br from-black via-zinc-900 to-[#00FF8F10] flex items-center justify-center p-3">
                        <div className="text-center">
                          <div className="text-white font-bold text-sm sm:text-lg truncate">{p.displayName || p.name}</div>
                          {p.tagline && (
                            <div className="text-zinc-200/85 text-[10px] sm:text-xs italic mt-1 line-clamp-1">{p.tagline}</div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="p-3 sm:p-4">
                      {p.highlights && p.highlights.length > 0 && (
                        <div className="mb-2 sm:mb-3 flex flex-wrap gap-1.5 sm:gap-2">
                          {p.highlights.slice(0, 3).map((h: string) => (
                            <span 
                              key={h} 
                              className="px-1.5 sm:px-2 py-0.5 rounded-full bg-[var(--bg)] border border-[var(--border)] text-[var(--primary)] text-[10px] sm:text-xs font-bold"
                            >
                              {h}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {p.tools && p.tools.slice(0, 3).map((icon: string) => {
                          const t = getTool(icon);
                          if (!t) return null;
                          return (
                            <span 
                              key={icon} 
                              className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md border border-[var(--border)] transition-transform hover:scale-110 flex-shrink-0" 
                              style={{ background: (t.color || '#999') + '12' }}
                              title={t.name}
                            >
                              <Icon icon={t.icon} width={16} height={16} className="sm:w-[18px] sm:h-[18px]" style={{ color: t.color }} />
                            </span>
                          );
                        })}
                        <span className="ml-auto text-[10px] sm:text-xs text-[var(--text-muted)] flex items-center gap-1">
                          <Icon icon="mdi:star" width={12} height={12} className="sm:w-3.5 sm:h-3.5" />
                          {p.stars || 0}
                        </span>
                      </div>
                      {p.description && (
                        <p className="text-[10px] sm:text-xs text-[var(--text-muted)] mt-2 line-clamp-2 leading-relaxed">{p.description}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        {/* All Projects Section */}
        {activeSection === "all" && (
          <section className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">All Projects</h2>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">Projects from everyone in the community</p>
              </div>
            </div>

            {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          ) : allProjects.length === 0 ? (
            <div className="text-center py-12 sm:py-16 text-[var(--text-muted)] border border-[var(--border)] rounded-xl bg-[var(--surface)] px-4">
              <Icon icon="mdi:folder-outline" width={48} height={48} className="sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 opacity-50" />
              <p className="text-base sm:text-lg font-semibold mb-2">No projects yet</p>
              <p className="text-xs sm:text-sm">Be the first to showcase your project!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {allProjects.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="group rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {p.coverImage ? (
                    <div
                      className="h-40 w-full bg-center bg-cover relative transition-transform duration-300 group-hover:scale-105"
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
                  ) : (
                    <div className="h-40 w-full bg-gradient-to-br from-black via-zinc-900 to-[#00FF8F10] flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-white font-bold text-lg">{p.displayName || p.name}</div>
                        {p.tagline && (
                          <div className="text-zinc-200/85 text-xs italic mt-1">{p.tagline}</div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="p-4">
                    {p.highlights && p.highlights.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-2">
                        {p.highlights.slice(0, 3).map((h: string) => (
                          <span 
                            key={h} 
                            className="px-2 py-0.5 rounded-full bg-[var(--bg)] border border-[var(--border)] text-[var(--primary)] text-xs font-bold"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      {p.tools && p.tools.slice(0, 3).map((icon: string) => {
                        const t = getTool(icon);
                        if (!t) return null;
                        return (
                          <span 
                            key={icon} 
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border)] transition-transform hover:scale-110" 
                            style={{ background: (t.color || '#999') + '12' }}
                            title={t.name}
                          >
                            <Icon icon={t.icon} width={18} height={18} style={{ color: t.color }} />
                          </span>
                        );
                      })}
                      <span className="ml-auto text-xs text-[var(--text-muted)] flex items-center gap-1">
                        <Icon icon="mdi:star" width={14} height={14} />
                        {p.stars || 0}
                      </span>
                    </div>
                    {p.description && (
                      <p className="text-xs text-[var(--text-muted)] mt-2 line-clamp-2">{p.description}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            )}
          </section>
        )}
      </div>
    </>
  );
}