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
  const [repoInfo, setRepoInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const [projectData, toolsData] = await Promise.all([
          api.projects.get(projectId),
          api.tools.list({ limit: 200 }),
        ]);
        setProject(projectData);
        setTools(toolsData);
        
        if (projectData.author) {
          const authorData = await api.users.get(projectData.author);
          setAuthor(authorData);
        }

        // If repoUrl exists, fetch additional GitHub info
        if (projectData.repoUrl && session) {
          try {
            const repoData = await api.github.analyze(projectData.repoUrl);
            setRepoInfo(repoData);
          } catch (error) {
            console.error("Failed to fetch repo info:", error);
          }
        }
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

  // Merge tools from project and repoInfo, filter out unknown tools
  const allToolIcons = Array.from(new Set([
    ...(project.tools || []),
    ...(repoInfo?.tools || []),
  ]));
  
  // Filter to only show tools that exist in database
  const allTools = allToolIcons.filter((icon: string) => {
    return getTool(tools, icon) !== undefined;
  });

  return (
    <div className="max-w-3xl mx-auto mt-4 mb-16 space-y-10">
      {/* Hero image & banner */}
      <section className="relative h-56 rounded-3xl overflow-hidden mb-6 border border-[var(--border)] shadow-lg flex flex-col justify-end">
        {project.coverImage ? (
          <img src={project.coverImage} alt={project.name} className="absolute inset-0 w-full h-full object-cover scale-105 blur-[2px] brightness-70" />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-black via-zinc-900 to-[#00FF8F10]" />
        )}
        <div className="relative z-10 flex flex-col md:flex-row items-end md:items-center gap-6 px-10 py-7">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-2xl mb-2">{project.displayName || project.name}</h1>
            <span className="font-serif text-lg text-zinc-100/85 italic mb-2 block max-w-2xl drop-shadow">{project.tagline || project.description}</span>
            {project.highlights && project.highlights.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {project.highlights.map((h: string) => (
                  <span key={h} className="px-3 py-1 rounded-full bg-[var(--surface)]/80 border border-[var(--border)] text-xs font-bold text-[var(--primary)] shadow backdrop-blur-sm">{h}</span>
                ))}
              </div>
            )}
          </div>
          <aside className="flex flex-col gap-3 items-end ml-auto">
            <div className="flex gap-1 mb-2">
              <span className="bg-black/60 border border-[var(--border)] rounded text-xs text-white px-2 py-1 shadow">★ {project.stars || repoInfo?.stars || 0}</span>
              <span className="bg-black/60 border border-[var(--border)] rounded text-xs text-white px-2 py-1 shadow">{allTools.length} Tools</span>
              {repoInfo?.language && (
                <span className="bg-black/60 border border-[var(--border)] rounded text-xs text-white px-2 py-1 shadow">{repoInfo.language}</span>
              )}
            </div>
            <div className="flex gap-2">
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-bold text-black shadow hover:scale-105 transition">
                View on GitHub ↗
              </a>
              {(project.demoUrl || repoInfo?.homepage) && (
                <a href={project.demoUrl || repoInfo?.homepage} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary)] bg-white/10 shadow hover:bg-[var(--primary)]/10 transition">
                  Live Demo
                </a>
              )}
            </div>
          </aside>
        </div>
      </section>

      {/* Main details */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-7">
        {/* About and Reflection */}
        <div className="md:col-span-3 space-y-5">
          <div className="bg-[var(--surface)] rounded-xl p-6 border border-[var(--border)] shadow">
            <div className="font-serif text-lg text-[var(--text)] mb-2 font-semibold">About</div>
            <div className="text-[var(--text-muted)] mb-2 leading-relaxed">
              {project.about || project.description || repoInfo?.description || "No description available for this project."}
            </div>
            {project.reflection && (
              <div className="mt-4 pt-4 border-t border-[var(--border)]">
                <div className="font-serif text-base text-[var(--text)] mb-2 italic">"{project.reflection}"</div>
              </div>
            )}
          </div>
        </div>
        {/* Author/Team */}
        <aside className="flex flex-col gap-4">
          <div className="p-4 bg-white/10 border border-[var(--border)] rounded-xl shadow flex flex-col gap-2 items-center text-sm">
            <div className="mb-1 font-semibold text-[var(--primary)]">Project by</div>
            {author ? (
              <Link href={`/profile/${author.username}`} className="flex flex-col items-center gap-1 group">
                <img src={author.avatarUrl || "/default-avatar.png"} alt={author.username} width={44} height={44} className="rounded-full border-2 border-[var(--primary)]" />
                <span className="text-[var(--text)] group-hover:underline font-semibold">{author.displayName}</span>
                <span className="text-xs text-[var(--primary)]">@{author.username}</span>
              </Link>
            ) : (
              <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center">
                <Icon icon="mdi:account-circle" width={36} height={36} className="text-zinc-400" />
              </div>
            )}
          </div>
        </aside>
      </section>

      {/* Tech Stack grid */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-6 shadow-sm mt-2">
        <div className="mb-4 text-sm uppercase tracking-wide text-[var(--text-muted)] font-semibold">Tech Stack & Tools</div>
        {allTools.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-5">
              {allTools.map((icon: string) => {
                const t = getTool(tools, icon);
                if (!t) return null; // Skip unknown tools
                return (
                  <a key={icon} href={t.site || "#"} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 rounded-lg border border-[var(--border)] p-4 min-w-[92px] bg-[var(--bg)] hover:scale-105 hover:shadow-lg transition">
                    <Icon icon={t.icon} width={36} height={36} style={{ color: t.color }} />
                    <div className="text-[var(--primary)] font-bold text-sm mt-1">{t.name}</div>
                    <div className="text-xs text-[var(--text-muted)]">{t.category}</div>
                  </a>
                );
              })}
            </div>
            {repoInfo?.topics && repoInfo.topics.length > 0 && (
              <div className="mt-6 pt-6 border-t border-[var(--border)]">
                <div className="mb-3 text-sm uppercase tracking-wide text-[var(--text-muted)] font-semibold">GitHub Topics</div>
                <div className="flex flex-wrap gap-2">
                  {repoInfo.topics.map((topic: string) => (
                    <span key={topic} className="px-3 py-1 rounded-full bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text-muted)] hover:border-[var(--primary)] transition">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-[var(--text-muted)]">
            <p>No tech stack information available.</p>
            {project.repoUrl && (
              <p className="text-xs mt-2">Tech stack detection requires package.json in the repository.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
