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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <h1 className="text-lg sm:text-xl font-semibold">Lists</h1>
        {session && (
          <Link
            href="/lists/new"
            className="w-full sm:w-auto rounded-full bg-[var(--primary)] px-4 py-2 text-xs sm:text-sm font-medium text-black shadow-[0_0_0_1px_#00FF8F40,_0_8px_30px_rgba(0,0,0,0.6)] hover:opacity-90 transition-opacity text-center min-h-[44px] sm:min-h-0 flex items-center justify-center"
          >
            Create List
          </Link>
        )}
      </div>
      {lists.length === 0 ? (
        <div className="text-center py-8 sm:py-12 text-[var(--text-muted)] px-4">
          <Icon icon="mdi:folder-outline" width={40} height={40} className="sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-50" />
          <p className="text-base sm:text-lg mb-2">No lists yet</p>
          {session && (
            <Link
              href="/lists/new"
              className="mt-4 inline-block text-sm sm:text-base text-[var(--primary)] hover:underline transition-colors"
            >
              Create your first list →
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {lists.map((l) => (
            <Link
              key={l.id}
              href={`/lists/${l.id}`}
              className="group rounded-lg sm:rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4 hover:bg-white/5 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              {l.cover && (
                <div
                  className="aspect-[3/1.2] rounded-lg overflow-hidden mb-2 sm:mb-3 border border-[var(--border)] bg-center bg-cover transition-transform group-hover:scale-105"
                  style={{ backgroundImage: `url(${l.cover})` }}
                />
              )}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-medium text-sm sm:text-base truncate">{l.title}</h2>
                    {l.visibility === "private" && (
                      <span title="Private list" className="flex-shrink-0">
                        <Icon
                          icon="mdi:lock"
                          width={14}
                          height={14}
                          className="sm:w-4 sm:h-4 text-[var(--text-muted)]"
                        />
                      </span>
                    )}
                  </div>
                  {l.description && (
                    <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 line-clamp-2 leading-relaxed">{l.description}</p>
                  )}
                </div>
              </div>
              <div className="mt-2 flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-[var(--text-muted)] flex-wrap">
                <span>{l.count || 0} tools</span>
                <span className="truncate">by @{l.author}</span>
                {l.visibility === "private" && (
                  <span className="flex items-center gap-1">
                    <Icon icon="mdi:lock" width={10} height={10} className="sm:w-3 sm:h-3" />
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
