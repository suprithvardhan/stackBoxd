import { notFound } from "next/navigation";
import { mockProjects, mockTools, mockUser, mockUsers } from "@/lib/mock-data";
import { Icon } from "@iconify/react";
import Link from "next/link";

function getColor(icon: string) {
  return mockTools.find((t) => t.icon === icon)?.color || undefined;
}
function getTool(slugOrIcon: string) {
  return mockTools.find((t) => t.slug === slugOrIcon || t.icon === slugOrIcon);
}
function getUser(username: string) {
  return mockUsers.find(u => u.username === username);
}

type Params = { params: Promise<{ id: string }> };

export default async function ProjectPage({ params }: Params) {
  const { id } = await params;
  const project = mockProjects.find((p) => p.id === id);
  if (!project) return notFound();
  const author = getUser(project.author);
  return (
    <div className="max-w-3xl mx-auto mt-4 mb-16 space-y-10">
      {/* Hero image & banner */}
      <section className="relative h-56 rounded-3xl overflow-hidden mb-6 border border-[var(--border)] shadow-lg flex flex-col justify-end">
        <img src={project.coverImage} alt={project.name} className="absolute inset-0 w-full h-full object-cover scale-105 blur-[2px] brightness-70" />
        <div className="relative z-10 flex flex-col md:flex-row items-end md:items-center gap-6 px-10 py-7">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-2xl mb-2">{project.displayName || project.name}</h1>
            <span className="font-serif text-lg text-zinc-100/85 italic mb-2 block max-w-2xl drop-shadow">{project.tagline || project.description}</span>
            <div className="flex flex-wrap gap-2 mt-3">
              {project.highlights && project.highlights.map((h: string) => (
                <span key={h} className="px-3 py-1 rounded-full bg-[var(--surface)]/80 border border-[var(--border)] text-xs font-bold text-[var(--primary)] shadow backdrop-blur-sm">{h}</span>
              ))}
            </div>
          </div>
          <aside className="flex flex-col gap-3 items-end ml-auto">
            <div className="flex gap-1 mb-2">
              <span className="bg-black/60 border border-[var(--border)] rounded text-xs text-white px-2 py-1 shadow">★ {project.stars}</span>
              <span className="bg-black/60 border border-[var(--border)] rounded text-xs text-white px-2 py-1 shadow">{project.tools.length} Tools</span>
            </div>
            <div className="flex gap-2">
              <a href={project.repoUrl} target="_blank" className="rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-bold text-black shadow hover:scale-105 transition">View Repo ↗</a>
              {project.demoUrl && (
                <a href={project.demoUrl} target="_blank" className="rounded-full border border-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary)] bg-white/10 shadow hover:bg-[var(--primary)]/10 transition">Live Demo</a>
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
            <div className="text-[var(--text-muted)] mb-2 leading-relaxed">{project.about || project.description}</div>
            <div className="mt-4">
              <div className="font-serif text-base text-[var(--text)] mb-2 italic">"{project.reflection}"</div>
            </div>
          </div>
        </div>
        {/* Author/Team */}
        <aside className="flex flex-col gap-4">
          <div className="p-4 bg-white/10 border border-[var(--border)] rounded-xl shadow flex flex-col gap-2 items-center text-sm">
            <div className="mb-1 font-semibold text-[var(--primary)]">Project by</div>
            {author ? (
              <Link href={`/profile/${author.username}`} className="flex flex-col items-center gap-1 group">
                <img src={author.avatarUrl} alt={author.username} width={44} height={44} className="rounded-full border-2 border-[var(--primary)]" />
                <span className="text-[var(--text)] group-hover:underline font-semibold">{author.displayName}</span>
                <span className="text-xs text-[var(--primary)]">@{author.username}</span>
              </Link>
            ) : (
              <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center">
                <Icon icon="mdi:account-circle" width={36} height={36} className="text-zinc-400" />
              </div>
            )}
            {project.team && project.team.length > 1 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {project.team.map(u => (
                  <Link key={u} href={`/profile/${u}`} className="rounded-full bg-[var(--bg)] border border-[var(--border)] px-3 py-0.5 text-xs text-[var(--primary)] font-bold hover:underline">@{u}</Link>
                ))}
              </div>
            )}
          </div>
        </aside>
      </section>

      {/* Tech Stack grid */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-6 shadow-sm mt-2">
        <div className="mb-2 text-sm uppercase tracking-wide text-[var(--text-muted)] font-semibold">Stack & Tools</div>
        <div className="flex flex-wrap gap-5">
          {project.tools.map((i) => {
            const t = getTool(i);
            if (!t) return null;
            return (
              <a key={i} href={t.site} target="_blank" className="flex flex-col items-center gap-1 rounded-lg border border-[var(--border)] p-4 min-w-[92px] bg-[var(--bg)] hover:scale-105 hover:shadow-lg transition">
                <Icon icon={t.icon} width={36} height={36} style={{ color: t.color }} />
                <div className="text-[var(--primary)] font-bold text-sm mt-1">{t.name}</div>
                <div className="text-xs text-[var(--text-muted)]">{t.category}</div>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}


