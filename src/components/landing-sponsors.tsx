"use client";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { Heart, ArrowRight, Sparkles } from "lucide-react";

const SPONSORS = [
  {
    name: "Vercel",
    logo: "simple-icons:vercel",
    url: "https://vercel.com",
    description: "Infrastructure partner powering Stackboxd's global edge network",
    color: "#000000",
  },
];

export default function LandingSponsors() {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.12,
            delayChildren: 0.13,
          },
        },
      }}
      className="mx-auto mt-24 max-w-7xl w-full"
    >
      {/* Header */}
      <div className="mb-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 15 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 mb-4"
        >
          <Heart className="w-4 h-4 text-[var(--primary)] fill-[var(--primary)]" />
          <span className="text-sm font-medium text-[var(--primary)]">Proudly Sponsored</span>
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">Built on World-Class Infrastructure</h2>
        <p className="text-lg text-[var(--text-muted)] max-w-xl mx-auto">
          Stackboxd is powered by cutting-edge platforms that enable us to deliver the best experience worldwide
        </p>
      </div>

      {/* Sponsor Grid - Matching testimonial style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {SPONSORS.map((sponsor, i) => (
          <motion.a
            key={sponsor.name}
            href={sponsor.url}
            target="_blank"
            rel="noopener noreferrer"
            variants={{
              hidden: { opacity: 0, y: 50 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{ type: "spring", damping: 18, mass: 1 }}
            whileHover={{ scale: 1.04, boxShadow: "0 8px 30px 0 #00FF8F30" }}
            className="group relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 flex flex-col gap-4 items-start min-h-[210px] shadow-sm cursor-pointer transition overflow-hidden"
          >
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10 w-full">
              {/* Logo and Name Row */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-white p-2.5 flex items-center justify-center border border-[var(--border)] shadow-sm group-hover:shadow-md transition">
                  <Icon 
                    icon={sponsor.logo} 
                    width={28} 
                    height={28}
                    style={{ color: sponsor.color || "#000000" }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold tracking-tight">{sponsor.name}</h3>
                    <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all" />
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                      Infrastructure
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                {sponsor.description}
              </p>

              {/* Features */}
              <div className="mt-4 pt-4 border-t border-[var(--border)] flex flex-wrap gap-3">
                <span className="text-xs text-[var(--text-muted)]">Edge Network</span>
                <span className="text-xs text-[var(--text-muted)]">•</span>
                <span className="text-xs text-[var(--text-muted)]">Zero Config</span>
                <span className="text-xs text-[var(--text-muted)]">•</span>
                <span className="text-xs text-[var(--text-muted)]">Global CDN</span>
              </div>
            </div>
          </motion.a>
        ))}

        {/* CTA Card - Matching feature card style */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 50 },
            show: { opacity: 1, y: 0 },
          }}
          transition={{ type: "spring", damping: 18, mass: 1 }}
          whileHover={{ scale: 1.04, boxShadow: "0 8px 30px 0 #00FF8F30" }}
          className="rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--primary)]/10 via-[var(--primary)]/5 to-transparent p-7 flex flex-col gap-4 items-start min-h-[210px] shadow-sm cursor-pointer transition"
        >
          <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/20 border border-[var(--primary)]/30 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-[var(--primary)]" />
          </div>
          <h3 className="font-bold text-base tracking-tight">Interested in Sponsoring?</h3>
          <p className="text-[var(--text-muted)] text-sm">
            Help us grow the developer community and reach more builders worldwide
          </p>
          <a
            href="mailto:sponsors@stackboxd.com"
            className="mt-auto inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--primary)] text-black font-semibold text-sm hover:bg-[var(--primary)]/90 transition hover:scale-105 shadow-lg shadow-[var(--primary)]/20"
          >
            Get in Touch
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center">
        <p className="text-sm text-[var(--text-muted)]">
          Made with <span className="text-[var(--primary)]">❤️</span> for developers
        </p>
      </div>
    </motion.section>
  );
}
