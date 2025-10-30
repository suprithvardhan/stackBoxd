import Link from "next/link";
import { Icon } from "@iconify/react";
import { mockTools } from "@/lib/mock-data";

const mockList = {
  id: "lst_01",
  title: "Frontend stacks that actually ship",
  items: ["nextjs", "vite", "vercel", "tanstack-query", "react", "tailwindcss", "typescript"],
  followers: 329,
};

function getTool(slug: string) {
  return mockTools.find((t) => t.slug === slug);
}

export default function ListDetailPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{mockList.title}</h1>
          <p className="text-sm text-[var(--text-muted)]">{mockList.followers} followers</p>
        </div>
        <button className="rounded-full border border-[var(--border)] px-4 py-2 text-sm">Follow List</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {mockList.items.map((slug) => {
          const tool = getTool(slug);
          return tool ? (
            <Link key={slug} href={`/tools/${slug}`} className="flex flex-col items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 hover:scale-[1.027] shadow transition group">
              <div className="rounded-2xl p-4 border border-[var(--border)] shadow" style={{ background: tool.color + '11' }}>
                <Icon icon={tool.icon} width={40} height={40} style={{ color: tool.color }} />
              </div>
              <div className="text-lg font-bold tracking-tight" style={{ color: tool.color }}>{tool.name}</div>
              <div className="text-xs text-[var(--text-muted)]">{tool.category}</div>
              <div className="w-full h-2 mt-3 rounded-full" style={{ background: tool.color + '33' }} />
            </Link>
          ) : (
            <div key={slug} className="flex flex-col items-center justify-center gap-2 rounded-xl border bg-[var(--surface)] border-[var(--border)] p-6">
              <div className="rounded-2xl h-10 w-10 bg-zinc-700 flex items-center justify-center" />
              <div className="text-base font-semibold">{slug}</div>
              <div className="text-xs text-[var(--text-muted)]">Unknown tool</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


