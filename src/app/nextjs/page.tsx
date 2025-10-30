import { mockTools, mockLogs, mockProjects, mockUsers } from "@/lib/mock-data";
import { Icon } from "@iconify/react";
import Link from "next/link";

const tool = mockTools.find(t => t.slug === "nextjs");
function getUser(username: string) {
  return mockUsers.find(u => u.username === username);
}

const NextjsWhiteSVG = () => (
  <svg fill="none" viewBox="0 0 512 308" width={66} height={66} xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="none" />
    <path d="M120.524 136.485H143.56L162.025 187.907H161.726L143.729 136.485ZM134.807 98.5938C82.6784 98.5938 48.2796 135.06 48.2796 185.592C48.2796 235.466 82.6784 271.894 134.807 271.894C162.379 271.894 184.732 262.441 199.422 249.236L187.939 234.69C176.239 244.905 158.745 253.547 134.807 253.547C93.9184 253.547 70.9367 227.399 70.9367 185.592C70.9367 143.608 93.9184 117.46 134.807 117.46C158.745 117.46 176.239 126.102 187.939 136.316L199.422 121.77C184.732 108.565 162.379 98.5938 134.807 98.5938ZM269.033 98.5938H247.273V271.894H269.033V98.5938ZM284.106 98.5938V271.894H305.766V141.571H306.153C311.077 129.464 321.266 117.46 338.638 117.46C345.422 117.46 349.814 118.617 355.059 121.618V100.944C349.498 99.2848 344.589 98.5938 337.948 98.5938C316.563 98.5938 301.378 115.946 296.799 128.655H296.417V98.5938H284.106ZM383.899 98.5938C362.091 98.5938 347.011 114.799 347.011 137.635C347.011 171.052 386.87 162.797 386.87 185.829C386.87 192.719 381.551 198.338 369.116 198.338C361.267 198.338 352.393 194.13 346.956 189.273V210.829C353.197 214.206 362.274 217.836 372.293 217.836C392.726 217.836 404.098 206.862 404.098 191.402C404.098 155.739 363.02 164.823 363.02 138.395C363.02 132.941 367.073 128.203 374.875 128.203C382.471 128.203 390.389 130.668 397.021 135.198V114.358C390.965 110.55 383.829 108.703 383.899 108.703ZM457.09 103.731C439.999 103.731 427.938 111.563 421.013 120.618L432.405 131.008C435.067 126.444 441.649 120.713 449.956 120.713C458.982 120.713 465.965 127.46 465.965 138.343V271.894H487.739V137.622C487.739 119.91 474.203 103.731 457.09 103.731Z" fill="#fff" />
  </svg>
);

export default function NextjsToolPage() {
  if (!tool) return <div>Tool not found.</div>;
  const logs = mockLogs.filter(l => l.tool.slug === tool.slug);
  const relatedProjects = mockProjects.filter(p => p.tools.includes(tool.icon));
  return (
    <div className="space-y-10 mx-auto max-w-5xl w-full">
      <section className="flex items-center gap-8">
        <div className="rounded-2xl p-6 bg-white/5 border border-[var(--border)] shadow" style={{ background: tool.color + "11" }}>
          <NextjsWhiteSVG />
        </div>
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#E0E0E0' }}>{tool.name}</h1>
          <div className="mt-2 text-base italic text-[var(--text-muted)] max-w-xl">
            Next.js is a popular React framework for building fast and scalable web applications, offering features like file-based routing, server-side rendering, and powerful developer experience.
          </div>
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
                      <NextjsWhiteSVG />
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
