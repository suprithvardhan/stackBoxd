"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Icon } from "@iconify/react";
import { Sparkles, TrendingUp, Calendar, Users, FolderKanban, Zap, Code2, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

export default function LandingStackCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Enhanced 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseXRelative = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseYRelative = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(mouseXRelative);
    mouseY.set(mouseYRelative);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const userStats = {
    toolsLogged: 14,
    projects: 6,
    lists: 5,
    followers: 142,
    languages: [
      { name: "Go", icon: "simple-icons:go", color: "#00ADD8" },
      { name: "TypeScript", icon: "simple-icons:typescript", color: "#3178C6" },
      { name: "Python", icon: "simple-icons:python", color: "#3776AB" },
    ],
    joinDate: "2024",
  };

  const featuredTools = [
    { name: "Next.js", icon: "simple-icons:nextdotjs", color: "#0070F3", label: "Most Used" },
    { name: "Postgres", icon: "simple-icons:postgresql", color: "#336791", label: "Top DB" },
    { name: "Prisma", icon: "simple-icons:prisma", color: "#2D3748", label: "New 2024" },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ type: "spring", damping: 20, mass: 0.9 }}
      className="mx-auto mt-24 max-w-7xl w-full"
    >
      {/* Header */}
      <div className="mb-12 text-center">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 15 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 mb-4"
        >
          <Sparkles className="w-4 h-4 text-[var(--primary)]" />
          <span className="text-sm font-medium text-[var(--primary)]">Stack Cards</span>
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Your Year in Tech, Visualized</h2>
        <p className="text-lg text-[var(--text-muted)] max-w-xl mx-auto">
          Create beautiful stack cards to showcase your developer journey
        </p>
      </div>

      {/* Premium Modern Card */}
      <div className="flex justify-center px-4">
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 25, mass: 0.8, delay: 0.2 }}
          className="relative w-full max-w-lg"
        >
          {/* Animated Glow Background */}
          <motion.div
            animate={{
              opacity: isHovered ? [0.5, 0.8, 0.5] : 0.3,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[var(--primary)]/30 via-purple-500/20 to-blue-500/30 blur-3xl -z-10"
          />

          {/* Main Card with Glassmorphism */}
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background Layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/95 via-black/90 to-zinc-900/95" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,255,143,0.08)_0%,transparent_50%,rgba(59,130,246,0.08)_100%)]" />
            
            {/* Glassmorphism Overlay */}
            <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/[0.02] to-white/[0.01] border border-white/10">
              {/* Decorative Grid Pattern */}
              <div 
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,255,143,0.1) 1px, transparent 1px),
                                   linear-gradient(90deg, rgba(0,255,143,0.1) 1px, transparent 1px)`,
                  backgroundSize: '30px 30px'
                }}
              />

              {/* Content */}
              <div className="relative z-10 p-8">
                {/* Top Section - Profile */}
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-5">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] to-blue-500 rounded-2xl blur-md opacity-50" />
                      <img
                        src="https://avatars.githubusercontent.com/u/1?v=4"
                        alt="avatar"
                        width={72}
                        height={72}
                        className="relative rounded-2xl border-2 border-white/20 shadow-xl"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[var(--primary)] border-2 border-zinc-900 flex items-center justify-center"
                      >
                        <div className="w-2 h-2 rounded-full bg-black" />
                      </motion.div>
                    </motion.div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-2xl font-bold tracking-tight text-white">Velt Cipher</h3>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="px-2 py-0.5 rounded-md bg-gradient-to-r from-[var(--primary)]/20 to-blue-500/20 border border-[var(--primary)]/30"
                        >
                          <span className="text-xs font-semibold text-[var(--primary)]">Pro</span>
                        </motion.div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Joined {userStats.joinDate}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Prominent Stat */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--primary)]/20 via-blue-500/10 to-purple-500/20 border border-[var(--primary)]/30 p-6 backdrop-blur-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/5 to-transparent" />
                  <div className="relative flex flex-col items-center text-center">
                    <div className="flex items-center gap-2 mb-2">
                      <Code2 className="w-6 h-6 text-[var(--primary)]" />
                      <span className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">Total Tools Logged</span>
                    </div>
                    <div className="text-5xl font-extrabold text-white mb-1">{userStats.toolsLogged}</div>
                    <div className="text-sm text-[var(--text-muted)]">Across all projects and lists</div>
                  </div>
                </motion.div>

                {/* Languages - Matching Featured Stack Style */}
                <div className="mb-8">
                  <div className="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-4 font-semibold">Top Languages</div>
                  <div className="grid grid-cols-3 gap-4">
                    {userStats.languages.map((lang, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.05, y: -4 }}
                        className="flex flex-col items-center group cursor-pointer"
                      >
                        <motion.div
                          whileHover={{ 
                            boxShadow: `0 12px 40px ${lang.color}40`,
                          }}
                          className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center mb-3 transition-all overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <Icon 
                            icon={lang.icon} 
                            width={40} 
                            height={40} 
                            className="relative z-10"
                            style={{ color: lang.color }} 
                          />
                        </motion.div>
                        <div className="text-xs font-medium text-[var(--text-muted)] mb-1">Language</div>
                        <div className="text-sm font-semibold text-white">{lang.name}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Featured Tools - Enhanced Display */}
                <div className="mb-8">
                  <div className="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-4 font-semibold">Featured Stack</div>
                  <div className="grid grid-cols-3 gap-4">
                    {featuredTools.map((tool, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.05, y: -4 }}
                        className="flex flex-col items-center group cursor-pointer"
                      >
                        <motion.div
                          whileHover={{ 
                            boxShadow: `0 12px 40px ${tool.color}40`,
                          }}
                          className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center mb-3 transition-all overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <Icon 
                            icon={tool.icon} 
                            width={40} 
                            height={40} 
                            className="relative z-10"
                            style={{ color: tool.color }} 
                          />
                        </motion.div>
                        <div className="text-xs font-medium text-[var(--text-muted)] mb-1">{tool.label}</div>
                        <div className="text-sm font-semibold text-white">{tool.name}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* CTA Button - Premium */}
                <Link href="/stack-card">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative w-full rounded-2xl overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-[#00E676] opacity-90 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <div className="relative flex items-center justify-center gap-2 px-6 py-4 text-base font-bold text-black">
                      <span>Share My Stack Card</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.button>
                </Link>
              </div>

              {/* Animated Background Orbs */}
              <motion.div
                animate={{
                  x: [0, 100, 0],
                  y: [0, 50, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/10 rounded-full blur-3xl -z-10"
              />
              <motion.div
                animate={{
                  x: [0, -80, 0],
                  y: [0, -60, 0],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -z-10"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
