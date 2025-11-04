"use client";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

const TESTIMONIALS = [
  {
    user: "@jamie__macdev",
    avatar: "simple-icons:react",
    color: "#61DAFB",
    quote: "Stackboxd is my new playground—writing short tool reviews is way more fun than GitHub READMEs!",
  },
  {
    user: "@codenikhil",
    avatar: "simple-icons:go",
    color: "#00ADD8",
    quote: "I never thought I’d reflect on infra tools, but the tagging and project linking is addictive.",
  },
  {
    user: "@sarahvue",
    avatar: "simple-icons:vuejs",
    color: "#42b883",
    quote: "Logging projects & curating lists feels like my movie life, but for code. Love the minimal UI!",
  },
  {
    user: "@tinkerpy",
    avatar: "simple-icons:python",
    color: "#3776AB",
    quote: "Finally a journal for all those Python frameworks I try and forget. Parallax headers are a delight.",
  },
  {
    user: "@devdeep",
    avatar: "simple-icons:docker",
    color: "#2496ED",
    quote: "Stack cards are social currency in my team now. Sharing my stack is addictive.",
  },
  {
    user: "@amytypes",
    avatar: "simple-icons:typescript",
    color: "#3178c6",
    quote: "There is life beyond NPM star counts. Rating tools has helped me mentor junior devs in real-time!",
  },
];

export default function LandingTestimonials() {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.14, delayChildren: 0.19 } },
      }}
      className="mx-auto mt-12 sm:mt-16 md:mt-24 max-w-6xl w-full px-4 sm:px-6"
    >
      <div className="mb-6 sm:mb-8 text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight mb-2">Real reflections. Real builders.</h2>
        <p className="text-sm sm:text-base md:text-lg text-[var(--text-muted)] max-w-xl mx-auto px-4">What devs say after logging, rating, and sharing their stacks. The word is out!</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-6">
        {TESTIMONIALS.slice(0, 3).map((t, i) => (
          <motion.div
            key={t.user}
            variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } }}
            transition={{ type: "spring", damping: 18, mass: 0.95 }}
            whileHover={{ scale: 1.03, boxShadow: `0 12px 40px ${t.color}33` }}
            className="rounded-xl sm:rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 md:p-7 shadow transition"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border border-[var(--border)] flex items-center justify-center flex-shrink-0" style={{ background: t.color + '11' }}>
                <Icon icon={t.avatar} width={20} height={20} className="sm:w-[26px] sm:h-[26px]" style={{ color: t.color }} />
              </div>
              <span className="font-semibold text-xs sm:text-sm md:text-base text-[var(--text)] truncate">{t.user}</span>
            </div>
            <blockquote className="text-xs sm:text-sm md:text-base text-[var(--text-muted)] italic leading-relaxed">"{t.quote}"</blockquote>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {TESTIMONIALS.slice(3).map((t, i) => (
          <motion.div
            key={t.user}
            variants={{ hidden: { opacity: 0, y: 50 }, show: { opacity: 1, y: 0 } }}
            transition={{ type: "spring", damping: 19, mass: 1 }}
            whileHover={{ scale: 1.03, boxShadow: `0 12px 40px ${t.color}33` }}
            className="rounded-xl sm:rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 md:p-7 shadow transition"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border border-[var(--border)] flex items-center justify-center flex-shrink-0" style={{ background: t.color + '11' }}>
                <Icon icon={t.avatar} width={20} height={20} className="sm:w-[26px] sm:h-[26px]" style={{ color: t.color }} />
              </div>
              <span className="font-semibold text-xs sm:text-sm md:text-base text-[var(--text)] truncate">{t.user}</span>
            </div>
            <blockquote className="text-xs sm:text-sm md:text-base text-[var(--text-muted)] italic leading-relaxed">"{t.quote}"</blockquote>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
