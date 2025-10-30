import { mockTools, mockLogs, mockProjects, mockUsers } from "@/lib/mock-data";
import { Icon } from "@iconify/react";
import Link from "next/link";

const tool = mockTools.find(t => t.slug === "react");
function getUser(username: string) {
  return mockUsers.find(u => u.username === username);
}

export default function ReactToolPage() {
  if (!tool) return <div>Tool not found.</div>;
  const logs = mockLogs.filter(l => l.tool.slug === tool.slug);
  const relatedProjects = mockProjects.filter(p => p.tools.includes(tool.icon));
  return (
    <div className="space-y-10 mx-auto max-w-5xl w-full">
      <section className="flex items-center gap-8">
        <div className="rounded-2xl p-6 bg-white/5 border border-[var(--border)] shadow" style={{ background: tool.color + "11" }}>
          <Icon icon={tool.icon} width={66} height={66} style={{ color: tool.color }} />
        </div>
        <div>
          <h1 className="text-3xl font-bold" style={{ color: tool.color }}>{tool.name}</h1>
          <div className="flex items-center gap-4 mt-1 mb-1">
            <span className="text-md font-semibold uppercase tracking-wide bg-[var(--bg)] px-2 py-0.5 rounded text-[var(--text-muted)]">{tool.category}</span>
            <span className="text-md font-semibold">⭐ {tool.avgRating.toFixed(1)}</span>
            <span className="text-[var(--text-muted)]">{tool.ratingsCount.toLocaleString()} ratings • Used by {tool.usedByCount.toLocaleString()} devs</span>
          </div>
          <a href={tool.site} className="mt-2 block text-[var(--secondary)] hover:underline" target="_blank" rel="noopener">{tool.site}</a>
        </div>
        <div className="ml-auto flex flex-col gap-2">
          <Link href={`/log/new?tool=${tool.slug}`} className="rounded-full bg-[var(--primary)] px-4 py-2 text-black text-sm font-bold shadow hover:scale-105 transition">Log Your Experience</Link>
        </div>
      </section>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 my-3">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 flex flex-col items-start">
          <span className="text-xs text-[var(--text-muted)]">Average Rating</span>
          <span className="font-extrabold text-2xl mt-2" style={{color:tool.color}}>{tool.avgRating.toFixed(1)}</span>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 flex flex-col items-start">
          <span className="text-xs text-[var(--text-muted)]">Users Logged</span>
          <span className="font-extrabold text-2xl mt-2" style={{color:tool.color}}>{tool.usedByCount.toLocaleString()}</span>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 flex flex-col items-start">
          <span className="text-xs text-[var(--text-muted)]">Total Reviews</span>
          <span className="font-extrabold text-2xl mt-2" style={{color:tool.color}}>{tool.ratingsCount.toLocaleString()}</span>
        </div>
      </div>
      <section>
        <h2 className="mb-3 text-lg font-semibold">Popular Logs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {logs.length > 0 ? (
            logs.map((log) => {
              const author = getUser(log.user);
              return (
                <div key={log.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 flex flex-col gap-1 shadow group">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border)]" style={{ background: tool.color + '15' }}>
                      <Icon icon={tool.icon} width={18} height={18} style={{ color: tool.color }} />
                    </span>
                    <Link href={`/profile/${log.user}`} className="text-sm font-semibold text-[var(--text)] hover:underline">{author ? author.displayName : `@${log.user}`}</Link>
                    <span className="ml-2 text-xs text-[var(--text-muted)]">{"★".repeat(log.rating)}</span>
                    <span className="ml-auto text-xs text-[var(--text-muted)]">{shortAgo(log.createdAt)}</span>
                  </div>
                  <div className="text-sm text-[var(--text-muted)] line-clamp-3">{log.review}</div>
                </div>
              );
            })
          ) : (
            <div className="text-[var(--text-muted)]">No one has logged this tool yet. Be the first!</div>
          )}
        </div>
      </section>
      {relatedProjects.length > 0 && (
        <section className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Used In Projects</h3>
          <div className="flex flex-wrap gap-5">
            {relatedProjects.map((proj) => (
              <Link
                key={proj.id}
                href={`/projects/${proj.id}`}
                className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow p-3 w-48 hover:bg-white/5"
              >
                <div className="w-full aspect-[4/2.2] rounded-lg border border-[var(--border)] bg-center bg-cover mb-2"
                  style={{ backgroundImage: `url(${proj.coverImage})` }} />
                <div className="font-medium text-sm mt-1">{proj.displayName || proj.name}</div>
                <div className="mt-1 flex gap-2">
                  {proj.tools.slice(0,2).map((ic) => {
                    const t = mockTools.find(t => t.icon === ic);
                    return <Icon key={ic} icon={ic} width={18} height={18} style={{ color: t?.color }} />;
                  })}
                </div>
                <div className="mt-2 text-xs text-[var(--text-muted)]">By {getUser(proj.author)?.displayName || `@${proj.author}`}</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function shortAgo(date: string) {
  const d = new Date(date);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60 * 60) return `${Math.round(diff / 60)}m ago`;
  if (diff < 48 * 3600) return `${Math.round(diff / 3600)}h ago`;
  return `${Math.round(diff / 86400)}d ago`;
}
