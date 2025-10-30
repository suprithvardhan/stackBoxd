"use client";

import { Icon } from "@iconify/react";
import { Heart, MessageCircle, Bookmark, Share2, Star } from "lucide-react";
import { motion } from "framer-motion";
import type { LogItem } from "@/lib/mock-data";

type Props = { item: LogItem };

export function FeedCardLog({ item }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm"
    >
      <header className="mb-3 flex items-center gap-3 text-sm text-[var(--text-muted)]">
        <div className="h-8 w-8 rounded-full bg-[var(--bg)]" />
        <div className="flex items-center gap-1">
          <span className="text-[var(--text)] font-medium">@{item.user}</span>
          <span className="text-[var(--text-muted)]">logged</span>
          <span className="text-[var(--text)]">{item.tool.name}</span>
          <span>· {timeAgo(item.createdAt)}</span>
        </div>
      </header>

      <div className="flex gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg)]">
          <Icon icon={item.tool.icon} width={28} height={28} />
        </div>
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <Star className="fill-[var(--accent)] stroke-[var(--accent)]" size={16} />
            <span className="text-sm text-[var(--text)]">{"★".repeat(item.rating)}</span>
          </div>
          <p className="text-[var(--text-muted)]">{item.review}</p>
          {item.project && (
            <div className="mt-2 inline-flex items-center gap-2 rounded-md border border-[var(--border)] px-2 py-1 text-xs text-[var(--text-muted)]">
              <Icon icon="lucide:link" />
              Used in <span className="text-[var(--text)]">{item.project.name}</span>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-4 flex items-center gap-4 text-sm text-[var(--text-muted)]">
        <button className="inline-flex items-center gap-2 hover:text-[var(--text)]">
          <Heart size={16} /> {item.reactions}
        </button>
        <button className="inline-flex items-center gap-2 hover:text-[var(--text)]">
          <MessageCircle size={16} /> {item.comments}
        </button>
        <button className="inline-flex items-center gap-2 hover:text-[var(--text)]">
          <Bookmark size={16} /> Save
        </button>
        <button className="inline-flex items-center gap-2 hover:text-[var(--text)]">
          <Share2 size={16} /> Share
        </button>
      </footer>
    </motion.article>
  );
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const hrs = Math.round(diff / 3_600_000);
  if (hrs < 1) return "just now";
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}


