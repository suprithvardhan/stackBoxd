"use client";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

const tools = [
  { icon: "simple-icons:react", color: "#61DAFB", name: "React" },
  { icon: "simple-icons:nextdotjs", color: "#0070F3", name: "Next.js" },
  { icon: "simple-icons:typescript", color: "#3178c6", name: "TypeScript" },
  { icon: "simple-icons:docker", color: "#2496ED", name: "Docker" },
  { icon: "simple-icons:tailwindcss", color: "#06B6D4", name: "Tailwind" },
  { icon: "simple-icons:postgresql", color: "#336791", name: "Postgres" },
  { icon: "simple-icons:golang", color: "#00ADD8", name: "Go" },
  { icon: "simple-icons:prisma", color: "#2D3748", name: "Prisma" },
  { icon: "simple-icons:vuejs", color: "#42b883", name: "Vue.js" },
  { icon: "simple-icons:svelte", color: "#FF3E00", name: "Svelte" },
];

const pos = [
  { x: -60, y: 0, s: 1.1, z: 4, r: -10 },
  { x: 60, y: 18, s: 1.13, z: 3, r: 11 },
  { x: 0, y: -50, s: 1.25, z: 5, r: 0 },
  { x: -120, y: 45, s: 0.98, z: 2, r: -8 },
  { x: 130, y: -32, s: 1.1, z: 3, r: 6 },
  { x: 80, y: 75, s: 0.87, z: 1, r: 12 },
  { x: -100, y: -50, s: 0.9, z: 1, r: -2 },
  { x: 40, y: -90, s: 0.85, z: 0, r: 6 },
  { x: -70, y: 100, s: 0.74, z: 0, r: -18 },
  { x: 90, y: -80, s: 0.77, z: 0, r: 8 },
];

export default function LogoCollage() {
  return (
    <motion.div initial="hidden" animate="show" variants={{
      hidden: {},
      show: {
        transition: { staggerChildren: 0.09, delayChildren: 0.1 },
      },
    }} className="relative w-[350px] h-[330px] md:w-[420px] md:h-[400px] flex items-center justify-center select-none pointer-events-none">
      {tools.map((t, i) => (
        <motion.div
          key={t.icon}
          variants={{
            hidden: { opacity: 0, scale: 0.7, y: pos[i]?.y || 0, x: pos[i]?.x || 0 },
            show:   { opacity: 1, scale: pos[i]?.s || 1, y: pos[i]?.y || 0, x: pos[i]?.x || 0 },
          }}
          transition={{ type: "spring", stiffness: 160, damping: 13 }}
          style={{ zIndex: pos[i]?.z, rotate: pos[i]?.r }}
          whileHover={{ scale: (pos[i]?.s || 1) * 1.12, zIndex: 99, filter: "brightness(1.18)" }}
          className="absolute flex flex-col items-center"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg border border-[var(--border)]" style={{ background: t.color + "11", boxShadow: `0 0 32px ${t.color}22` }}>
            <Icon icon={t.icon} width={44} height={44} style={{ color: t.color, filter: "drop-shadow(0 0 2px #0007)" }} />
          </span>
          <span className="mt-1 text-xs font-semibold tracking-tight" style={{ color: t.color }}>{t.name}</span>
        </motion.div>
      ))}
      <div className="pointer-events-none absolute inset-0 z-0 rounded-2xl" style={{boxShadow: '0 0 150px 0 #00ff8f22'}} />
    </motion.div>
  );
}
