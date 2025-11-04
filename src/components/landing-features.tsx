"use client";
import { motion } from "framer-motion";
import { Sparkles, Users, Heart, TerminalSquare, ActivitySquare } from "lucide-react";
import { Icon } from "@iconify/react";

const FEATURES = [
  {
    icon: <Sparkles className="text-[#00FF8F]" size={28} />,
    label: "Beautiful dev journaling",
    desc: "Logging tools is as fun and visual as building them—log entries feel like mini-reviews.",
  },
  {
    icon: <Icon icon="simple-icons:react" width={28} height={28} style={{ color: "#61DAFB" }} />,
    label: "Brand-rich Stacks",
    desc: "Your stack is instantly recognizable—show off with colored icons and modern tech badges.",
  },
  {
    icon: <Users className="text-[#2EC4B6]" size={28} />,
    label: "Social by default",
    desc: "Follow other devs, like and comment on logs, and curate public lists just like Letterboxd.",
  },
  {
    icon: <TerminalSquare className="text-[#DB2777]" size={28} />,
    label: "Project-first Logging",
    desc: "Link tools directly to projects to give each stack context. See how tools perform in the real world.",
  },
  {
    icon: <ActivitySquare className="text-[#F59E42]" size={28} />,
    label: "Insights & Trends",
    desc: "Discover trending tools, tech fads, and evergreen picks with real log/usage graphs.",
  },
];

export default function LandingFeatures() {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-5% 0px -5% 0px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.12, delayChildren: 0.13 } },
      }}
      className="mx-auto mt-12 sm:mt-16 md:mt-20 max-w-7xl w-full px-4 sm:px-6"
    >
      <div className="mb-6 sm:mb-8 text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight mb-2">Why Stackboxd?</h2>
        <p className="text-sm sm:text-base md:text-lg text-[var(--text-muted)] max-w-xl mx-auto px-4">Your developer life deserves a platform as sleek as your favorite movies site. Here's what makes us different.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.label}
            variants={{
              hidden: { opacity: 0, y: 50 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{ type: "spring", damping: 18, mass: 1 }}
            whileHover={{ scale: 1.04, boxShadow: "0 8px 30px 0 #00FF8F30" }}
            className="rounded-xl sm:rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 md:p-7 flex flex-col gap-3 sm:gap-4 items-start min-h-[180px] sm:min-h-[210px] shadow-sm cursor-pointer transition"
          >
            <div className="scale-90 sm:scale-100">{f.icon}</div>
            <div className="font-bold text-sm sm:text-base tracking-tight">{f.label}</div>
            <div className="text-[var(--text-muted)] text-xs sm:text-sm leading-relaxed">{f.desc}</div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
