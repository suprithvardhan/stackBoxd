"use client";
import { mockLogs } from "@/lib/mock-data";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

function starRow(n: number) {
  return Array.from({ length: n }).map((_, i) => (
    <span key={i} className="text-[var(--accent)]">★</span>
  ));
}

export default function LandingActivity() {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.14 } } }}
      className="mx-auto mt-24 max-w-7xl w-full"
    >
      <div className="mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">What devs are logging now</h2>
        <p className="text-lg text-[var(--text-muted)] max-w-xl mx-auto">Discover trending stacks and log entries—join the feed by journaling your tool adventures.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
        {mockLogs.slice(0, 6).map((log, i) => (
          <motion.div
            key={log.id}
            variants={{ hidden: { opacity: 0, y: 60 }, show: { opacity: 1, y: 0 } }}
            transition={{ type: "spring", damping: 22, mass: 1 }}
            whileHover={{ scale: 1.02, boxShadow: "0 8px 32px #00FF8F26" }}
            className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-6 flex flex-col gap-3 shadow-sm min-h-[192px] cursor-pointer transition"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-7 w-7 rounded-md flex items-center justify-center border border-[var(--border)]" style={{ background: (log.tool.slug === "react" ? "#61DAFB11" : log.tool.slug === "nextjs" ? "#0070F315" : "") }}>
                <Icon icon={log.tool.icon} width={20} height={20} style={{ color: log.tool.slug === "react" ? "#61DAFB" : log.tool.slug === "nextjs" ? "#0070F3" : undefined }} />
              </div>
              <span className="text-sm font-semibold text-[var(--text)]">{log.tool.name}</span>
              <span className="text-xs ml-1 text-[var(--text-muted)]">({starRow(log.rating)})</span>
              <span className="ml-auto text-xs text-[var(--text-muted)]">{ago(log.createdAt)}</span>
            </div>
            <div className="text-sm italic text-[var(--text-muted)] line-clamp-2">{log.review}</div>
            <div className="flex gap-2 mt-3 text-xs text-[var(--text-muted)]">
              <span>❤ {log.reactions}</span>
              <span>💬 {log.comments}</span>
              {log.tags.map((t) => (
                <span className="bg-[var(--surface)] border border-[var(--border)] rounded-full px-2 py-0.5 ml-1" key={t}>#{t}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function ago(date: string) {
  const d = new Date(date);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60 * 60) return `${Math.round(diff / 60)}m ago`;
  if (diff < 48 * 3600) return `${Math.round(diff / 3600)}h ago`;
  return `${Math.round(diff / 86400)}d ago`;
}
