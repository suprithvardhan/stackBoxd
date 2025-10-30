import { notFound } from "next/navigation";
import { mockLogs } from "@/lib/mock-data";
import { Icon } from "@iconify/react";
import Link from "next/link";

type Params = { params: { id: string } };

export default function LogDetail({ params }: Params) {
  const log = mockLogs.find((l) => l.id === params.id);
  if (!log) return notFound();

  return (
    <article className="space-y-6">
      <header className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded bg-[var(--bg)]">
          <Icon icon={log.tool.icon} width={18} height={18} />
        </div>
        <div>
          <h1 className="text-xl font-semibold">{log.tool.name}</h1>
          <p className="text-sm text-[var(--text-muted)]">by @{log.user}</p>
        </div>
        <Link href={`/tools/${log.tool.slug}`} className="ml-auto text-sm text-[var(--secondary)] hover:underline">View tool</Link>
      </header>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-[var(--text)]">{log.review}</p>
        {log.project && (
          <div className="mt-4 text-sm text-[var(--text-muted)]">Used in <Link href={`/projects/${log.project.id}`} className="text-[var(--secondary)] hover:underline">{log.project.name}</Link></div>
        )}
      </section>
    </article>
  );
}


