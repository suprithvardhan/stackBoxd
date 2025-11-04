"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";

export default function ListsIndexPage() {
  const { data: session } = useSession();
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const listsData = await api.lists.list({ limit: 50 });
        setLists(listsData);
      } catch (error) {
        console.error("Failed to load lists:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[var(--text-muted)]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Lists</h1>
        {session && (
          <Link
            href="/lists/new"
            className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-medium text-black shadow-[0_0_0_1px_#00FF8F40,_0_8px_30px_rgba(0,0,0,0.6)] hover:opacity-90 transition-opacity"
          >
            Create List
          </Link>
        )}
      </div>
      {lists.length === 0 ? (
        <div className="text-center py-12 text-[var(--text-muted)]">
          <Icon icon="mdi:folder-outline" width={48} height={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">No lists yet</p>
          {session && (
            <Link
              href="/lists/new"
              className="mt-4 inline-block text-[var(--primary)] hover:underline transition-colors"
            >
              Create your first list →
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {lists.map((l) => (
            <Link
              key={l.id}
              href={`/lists/${l.id}`}
              className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:bg-white/5 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              {l.cover && (
                <div
                  className="aspect-[3/1.2] rounded-lg overflow-hidden mb-3 border border-[var(--border)] bg-center bg-cover transition-transform group-hover:scale-105"
                  style={{ backgroundImage: `url(${l.cover})` }}
                />
              )}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-medium">{l.title}</h2>
                    {l.visibility === "private" && (
                      <span title="Private list">
                        <Icon
                          icon="mdi:lock"
                          width={16}
                          height={16}
                          className="text-[var(--text-muted)]"
                        />
                      </span>
                    )}
                  </div>
                  {l.description && (
                    <p className="text-sm text-[var(--text-muted)] mt-1 line-clamp-2">{l.description}</p>
                  )}
                </div>
              </div>
              <div className="mt-2 flex items-center gap-4 text-xs text-[var(--text-muted)]">
                <span>{l.count || 0} tools</span>
                <span>by @{l.author}</span>
                {l.visibility === "private" && (
                  <span className="flex items-center gap-1">
                    <Icon icon="mdi:lock" width={12} height={12} />
                    Private
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
