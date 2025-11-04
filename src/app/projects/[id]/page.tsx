"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

function getColor(tools: any[], icon: string) {
  return tools.find((t) => t.icon === icon)?.color || undefined;
}

function getTool(tools: any[], slugOrIcon: string) {
  // Try exact match first
  let tool = tools.find((t) => t.slug === slugOrIcon || t.icon === slugOrIcon);
  
  // If not found, try matching without prefix
  if (!tool && slugOrIcon.includes(":")) {
    const iconName = slugOrIcon.split(":")[1];
    // Try simple-icons prefix
    tool = tools.find((t) => t.icon === `simple-icons:${iconName}` || t.icon.endsWith(`:${iconName}`));
  }
  
  return tool;
}

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { data: session } = useSession();
  const [project, setProject] = useState<any>(null);
  const [tools, setTools] = useState<any[]>([]);
  const [author, setAuthor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const [projectData, toolsData] = await Promise.all([
          api.projects.get(projectId),
          api.tools.list({ limit: 1000 }), // Fetch all tools to ensure matching works
        ]);
        setProject(projectData);
        setTools(toolsData);
        
        if (projectData.author) {
          const authorData = await api.users.get(projectData.author);
          setAuthor(authorData);
        }

        // Tools are already stored in database from sync - no need to re-detect
        // repoInfo is only used for additional metadata like topics, which we can add later
      } catch (error) {
        console.error("Failed to load project:", error);
      } finally {
        setLoading(false);
      }
    };
    if (projectId) {
      loadProject();
    }
  }, [projectId, session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[var(--text-muted)]">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[var(--text-muted)]">Project not found</div>
      </div>
    );
  }

  // Tools are already stored in database from sync - no need to merge with repoInfo
  const allToolIcons = Array.from(new Set((project.tools || []) as string[]));
  
  // Filter to only show tools that exist in database
  const allTools = allToolIcons.filter((icon: string) => {
    return getTool(tools, icon) !== undefined;
  });

  return (
    <div className="max-w-3xl mx-auto mt-2 sm:mt-4 mb-8 sm:mb-16 space-y-6 sm:space-y-8 md:space-y-10 px-4 sm:px-0">
      {/* Hero image & banner */}
      <section className="relative h-40 sm:h-48 md:h-56 rounded-2xl sm:rounded-3xl overflow-hidden mb-4 sm:mb-6 border border-[var(--border)] shadow-lg flex flex-col justify-end">
        {project.coverImage ? (
          <img src={project.coverImage} alt={project.name} className="absolute inset-0 w-full h-full object-cover scale-105 blur-[2px] brightness-70" />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-black via-zinc-900 to-[#00FF8F10]" />
        )}
        <div className="relative z-10 flex flex-col md:flex-row items-end md:items-center gap-4 sm:gap-6 px-4 sm:px-6 md:px-10 py-4 sm:py-5 md:py-7">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white drop-shadow-2xl mb-1 sm:mb-2 truncate">{project.displayName || project.name}</h1>
            <span className="font-serif text-sm sm:text-base md:text-lg text-zinc-100/85 italic mb-2 block max-w-2xl drop-shadow line-clamp-2">{project.tagline || project.description}</span>
            {project.highlights && project.highlights.length > 0 && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                {project.highlights.map((h: string) => (
                  <span key={h} className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[var(--surface)]/80 border border-[var(--border)] text-[10px] sm:text-xs font-bold text-[var(--primary)] shadow backdrop-blur-sm">{h}</span>
                ))}
              </div>
            )}
          </div>
          <aside className="flex flex-col sm:flex-row md:flex-col gap-2 sm:gap-3 items-start sm:items-end md:items-end ml-auto w-full sm:w-auto">
            <div className="flex gap-1 mb-1 sm:mb-2">
              <span className="bg-black/60 border border-[var(--border)] rounded text-[10px] sm:text-xs text-white px-1.5 sm:px-2 py-0.5 sm:py-1 shadow">★ {project.stars || 0}</span>
              <span className="bg-black/60 border border-[var(--border)] rounded text-[10px] sm:text-xs text-white px-1.5 sm:px-2 py-0.5 sm:py-1 shadow">{allTools.length} Tools</span>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none rounded-full bg-[var(--primary)] px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-black shadow hover:scale-105 transition text-center min-h-[36px] sm:min-h-0 flex items-center justify-center">
                <span className="hidden sm:inline">View on GitHub</span>
                <span className="sm:hidden">GitHub</span>
                <span className="hidden md:inline ml-1">↗</span>
              </a>
              {project.demoUrl && (
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none rounded-full border border-[var(--primary)] px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-[var(--primary)] bg-white/10 shadow hover:bg-[var(--primary)]/10 transition text-center min-h-[36px] sm:min-h-0 flex items-center justify-center">
                  Live Demo
                </a>
              )}
            </div>
          </aside>
        </div>
      </section>

      {/* Main details */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-5 md:gap-7">
        {/* About and Reflection */}
        <div className="md:col-span-3 space-y-4 sm:space-y-5">
          <div className="bg-[var(--surface)] rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-[var(--border)] shadow">
            <div className="font-serif text-base sm:text-lg text-[var(--text)] mb-2 font-semibold">About</div>
            <div className="text-sm sm:text-base text-[var(--text-muted)] mb-2 leading-relaxed">
              {project.about || project.description || "No description available for this project."}
            </div>
            {project.reflection && (
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[var(--border)]">
                <div className="font-serif text-sm sm:text-base text-[var(--text)] mb-2 italic">"{project.reflection}"</div>
              </div>
            )}
          </div>
        </div>
        {/* Author/Team */}
        <aside className="flex flex-col gap-4">
          <div className="p-3 sm:p-4 bg-white/10 border border-[var(--border)] rounded-lg sm:rounded-xl shadow flex flex-col gap-2 items-center text-xs sm:text-sm">
            <div className="mb-1 font-semibold text-[var(--primary)]">Project by</div>
            {author ? (
              <Link href={`/profile/${author.username}`} className="flex flex-col items-center gap-1 group">
                <img src={author.avatarUrl || "/default-avatar.png"} alt={author.username} width={44} height={44} className="rounded-full border-2 border-[var(--primary)] h-10 w-10 sm:h-11 sm:w-11" />
                <span className="text-xs sm:text-sm text-[var(--text)] group-hover:underline font-semibold truncate max-w-[120px]">{author.displayName}</span>
                <span className="text-[10px] sm:text-xs text-[var(--primary)] truncate max-w-[120px]">@{author.username}</span>
              </Link>
            ) : (
              <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-zinc-800 flex items-center justify-center">
                <Icon icon="mdi:account-circle" width={32} height={32} className="sm:w-9 sm:h-9 text-zinc-400" />
              </div>
            )}
          </div>
        </aside>
      </section>

      {/* Tech Stack grid */}
      <section className="rounded-lg sm:rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6 shadow-sm mt-2">
        <div className="mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wide text-[var(--text-muted)] font-semibold">Tech Stack & Tools</div>
        {allTools.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-3 sm:gap-4 md:gap-5">
              {allTools.map((icon: string) => {
                const t = getTool(tools, icon);
                if (!t) return null; // Skip unknown tools
                return (
                  <a key={icon} href={t.site || "#"} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 rounded-lg border border-[var(--border)] p-2 sm:p-3 md:p-4 min-w-0 sm:min-w-[92px] bg-[var(--bg)] hover:scale-105 hover:shadow-lg transition">
                    <Icon icon={t.icon} width={28} height={28} className="sm:w-8 sm:h-8 md:w-9 md:h-9" style={{ color: t.color }} />
                    <div className="text-[var(--primary)] font-bold text-xs sm:text-sm mt-1 truncate w-full text-center">{t.name}</div>
                    <div className="text-[10px] sm:text-xs text-[var(--text-muted)] truncate w-full text-center">{t.category}</div>
                  </a>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-6 sm:py-8 text-[var(--text-muted)] px-4">
            <p className="text-sm sm:text-base">No tech stack information available.</p>
            {project.repoUrl && (
              <p className="text-xs mt-2">Tech stack detection requires package.json in the repository.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
