import Link from "next/link";

const mockLists = [
  { id: "lst_01", title: "Frontend stacks that actually ship", slug: "frontend-stacks-that-ship", followers: 329 },
  { id: "lst_02", title: "Minimalist dev tools I love", slug: "minimalist-dev-tools", followers: 188 },
];

export default function ListsIndexPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Lists</h1>
        <Link href="#" className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-medium text-black shadow-[0_0_0_1px_#00FF8F40,_0_8px_30px_rgba(0,0,0,0.6)]">Create List</Link>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {mockLists.map((l) => (
          <Link key={l.id} href={`/lists/${l.id}`} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:bg-white/5">
            <h2 className="font-medium">{l.title}</h2>
            <p className="text-sm text-[var(--text-muted)]">{l.followers} followers</p>
          </Link>
        ))}
      </div>
    </div>
  );
}


