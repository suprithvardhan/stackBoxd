"use client";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export default function LandingStackCard() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 88, scale: 0.93 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-12% 0px -7% 0px" }}
      transition={{ type: "spring", damping: 18, mass: 0.95, delay: 0.14 }}
      className="mx-auto mt-24 max-w-2xl w-full flex flex-col items-center"
    >
      <div className="relative rounded-3xl border border-[var(--border)] bg-gradient-to-br from-black/80 via-zinc-900/85 to-[#00FFD080] p-10 shadow-xl w-full flex flex-col items-center">
        {/* Avatar and name */}
        <div className="flex items-center gap-4 mb-7">
          <img src="https://avatars.githubusercontent.com/u/1?v=4" alt="avatar" width={60} height={60} className="rounded-full border-2 border-[var(--primary)] shadow-sm" />
          <div>
            <div className="font-bold text-xl tracking-tight text-[var(--text)]">suprithv</div>
            <div className="text-[var(--text-muted)] text-sm">js, go, python</div>
          </div>
        </div>
        {/* Stack summary */}
        <div className="flex flex-wrap justify-center gap-5 mb-7">
          <div className="flex flex-col items-center">
            <span className="text-xs text-[var(--text-muted)]">Most used</span>
            <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0070F313] border border-[var(--border)]"><Icon icon="simple-icons:nextdotjs" width={32} height={32} style={{color: '#0070F3'}} /></span>
            <div className="mt-1 text-xs font-bold tracking-tight">Next.js</div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-[var(--text-muted)]">Top database</span>
            <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-[#33679111] border border-[var(--border)]"><Icon icon="simple-icons:postgresql" width={32} height={32} style={{color: '#336791'}} /></span>
            <div className="mt-1 text-xs font-bold tracking-tight">Postgres</div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-[var(--text-muted)]">New this year</span>
            <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F59E4211] border border-[var(--border)]"><Icon icon="simple-icons:prisma" width={32} height={32} style={{color: '#2D3748'}} /></span>
            <div className="mt-1 text-xs font-bold tracking-tight">Prisma</div>
          </div>
        </div>
        {/* Extra summary */}
        <div className="flex flex-col gap-1 items-center mb-5">
          <span className="text-lg text-[var(--primary)] font-bold">14 tools logged</span>
          <span className="text-base text-[var(--text-muted)]">Top languages: Go, TypeScript, Python</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 4px 32px #00FF8F80" }}
          className="mt-2 rounded-full bg-[var(--primary)] px-8 py-3 text-base font-bold text-black shadow-[0_0_4px_#00FF8F70] focus:outline-none"
        >
          Share My Stack Card
        </motion.button>
      </div>
    </motion.section>
  );
}
