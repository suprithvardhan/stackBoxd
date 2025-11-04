"use client";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { Heart, ArrowRight, Sparkles } from "lucide-react";

// Template: Add your sponsors here
// Example structure:
// {
//   name: "Sponsor Name",
//   logo: "simple-icons:sponsor-icon", // Iconify icon name
//   url: "https://sponsor-website.com",
//   description: "Brief description of what they sponsor",
//   color: "#HEXCOLOR", // Logo color
// }
const SPONSORS: Array<{
  name: string;
  logo: string;
  url: string;
  description: string;
  color?: string;
  isTemplate?: boolean;
}> = [
  // Template sponsor card - shows potential sponsors how their company will appear
  {
    name: "Your Company Here",
    logo: "simple-icons:github",
    url: "#",
    description: "Want to display your company here? Sponsor Stackboxd and reach thousands of developers worldwide.",
    color: "#000000",
    isTemplate: true,
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
      className="mx-auto mt-12 sm:mt-16 md:mt-24 max-w-7xl w-full px-4 sm:px-6"
    >
      {/* Header */}
      <div className="mb-6 sm:mb-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 15 }}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 mb-3 sm:mb-4"
        >
          <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--primary)] fill-[var(--primary)]" />
          <span className="text-xs sm:text-sm font-medium text-[var(--primary)]">Proudly Sponsored</span>
        </motion.div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight mb-2">Our Sponsors</h2>
        <p className="text-sm sm:text-base md:text-lg text-[var(--text-muted)] max-w-xl mx-auto px-4">
          Organizations supporting Stackboxd and helping us grow the developer community
        </p>
      </div>

      {/* Sponsor Grid - Matching testimonial style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {SPONSORS.map((sponsor, i) => (
          <motion.div
            key={sponsor.name}
            onClick={() => {
              if (sponsor.url !== "#") {
                window.open(sponsor.url, "_blank", "noopener,noreferrer");
              } else if (sponsor.isTemplate) {
                // Scroll to CTA card or trigger email
                document.getElementById("sponsor-cta")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            variants={{
              hidden: { opacity: 0, y: 50 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{ type: "spring", damping: 18, mass: 1 }}
            whileHover={sponsor.url !== "#" || sponsor.isTemplate ? { scale: 1.04, boxShadow: "0 8px 30px 0 #00FF8F30" } : {}}
            className={`group relative rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-7 flex flex-col gap-3 sm:gap-4 items-start min-h-[180px] sm:min-h-[210px] shadow-sm transition overflow-hidden ${
              sponsor.isTemplate 
                ? "border-2 border-[var(--primary)]/30 bg-[var(--primary)]/5 cursor-pointer hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/10" 
                : sponsor.url !== "#" 
                ? "border border-[var(--border)] cursor-pointer bg-[var(--surface)]" 
                : "border border-[var(--border)] cursor-default opacity-60 bg-[var(--surface)]"
            }`}
            style={sponsor.isTemplate ? { borderStyle: "dashed" } : undefined}
          >
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10 w-full">
              {/* Logo and Name Row */}
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-white p-2 sm:p-2.5 flex items-center justify-center border border-[var(--border)] shadow-sm group-hover:shadow-md transition flex-shrink-0">
                  <Icon 
                    icon={sponsor.logo} 
                    width={22} 
                    height={22}
                    className="sm:w-7 sm:h-7"
                    style={{ color: sponsor.color || "#000000" }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold tracking-tight truncate">{sponsor.name}</h3>
                    {(sponsor.url !== "#" || sponsor.isTemplate) && (
                      <ArrowRight className={`w-4 h-4 transition-all ${
                        sponsor.isTemplate 
                          ? "text-[var(--primary)]" 
                          : "text-[var(--text-muted)] group-hover:text-[var(--primary)]"
                      } group-hover:translate-x-1`} />
                    )}
                  </div>
                  {sponsor.url !== "#" && (
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                        Infrastructure
                      </span>
                    </div>
                  )}
                  {sponsor.isTemplate && (
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/30">
                        Sponsor Us
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-[var(--text-muted)] text-xs sm:text-sm leading-relaxed">
                {sponsor.description}
              </p>

              {/* Features - Customize per sponsor */}
              {sponsor.url !== "#" && !sponsor.isTemplate && (
                <div className="mt-4 pt-4 border-t border-[var(--border)] flex flex-wrap gap-3">
                  <span className="text-xs text-[var(--text-muted)]">Infrastructure</span>
                  <span className="text-xs text-[var(--text-muted)]">•</span>
                  <span className="text-xs text-[var(--text-muted)]">Partnership</span>
                  <span className="text-xs text-[var(--text-muted)]">•</span>
                  <span className="text-xs text-[var(--text-muted)]">Support</span>
                </div>
              )}
              {sponsor.isTemplate && (
                <div className="mt-4 pt-4 border-t border-[var(--border)]/50">
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    This is how your company will appear. Sponsor us to get featured here and reach thousands of developers.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {/* CTA Card - Matching feature card style */}
        <motion.div
          id="sponsor-cta"
          variants={{
            hidden: { opacity: 0, y: 50 },
            show: { opacity: 1, y: 0 },
          }}
          transition={{ type: "spring", damping: 18, mass: 1 }}
          whileHover={{ scale: 1.04, boxShadow: "0 8px 30px 0 #00FF8F30" }}
          className="rounded-xl sm:rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--primary)]/10 via-[var(--primary)]/5 to-transparent p-5 sm:p-6 md:p-7 flex flex-col gap-3 sm:gap-4 items-start min-h-[180px] sm:min-h-[210px] shadow-sm cursor-pointer transition"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[var(--primary)]/20 border border-[var(--primary)]/30 flex items-center justify-center">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--primary)]" />
          </div>
          <h3 className="font-bold text-sm sm:text-base tracking-tight">Interested in Sponsoring?</h3>
          <p className="text-[var(--text-muted)] text-xs sm:text-sm leading-relaxed">
            Help us grow the developer community and reach more builders worldwide
          </p>
          <a
            href="mailto:sponsors@stackboxd.com"
            className="mt-auto w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-[var(--primary)] text-black font-semibold text-xs sm:text-sm hover:bg-[var(--primary)]/90 transition hover:scale-105 shadow-lg shadow-[var(--primary)]/20 min-h-[44px]"
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
