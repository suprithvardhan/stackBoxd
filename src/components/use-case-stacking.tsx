"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";
import Lenis from "lenis";
import { BookOpen, Users, Zap, Rocket, BarChart3, Shield, FileCode, X } from "lucide-react";

const USE_CASES = [
  {
    title: "Personal Developer Journal",
    description: "Track your tool choices over time and remember why you picked certain libraries.",
    icon: <BookOpen className="w-6 h-6" />,
    features: ["Timeline view", "Rating history", "Reflection notes"],
  },
  {
    title: "Team Stack Sharing",
    description: "Showcase your team's stack and decision-making process in one beautiful place.",
    icon: <Users className="w-6 h-6" />,
    features: ["Project linking", "Team profiles", "Shared lists"],
  },
  {
    title: "Tool Discovery",
    description: "Find the best tools for your next project by exploring what other developers use.",
    icon: <Zap className="w-6 h-6" />,
    features: ["Trending tools", "Ratings & reviews", "Use case examples"],
  },
  {
    title: "Portfolio Building",
    description: "Create beautiful stack cards to showcase your technical expertise.",
    icon: <Rocket className="w-6 h-6" />,
    features: ["Stack cards", "Custom branding", "Social sharing"],
  },
  {
    title: "Retrospective Tool",
    description: "Use logs to facilitate team retros and understand your tech stack evolution.",
    icon: <BarChart3 className="w-6 h-6" />,
    features: ["Analytics", "Stack trends", "Decision tracking"],
  },
  {
    title: "Open Source Showcase",
    description: "Document your open source projects with detailed tool breakdowns and reasoning.",
    icon: <Shield className="w-6 h-6" />,
    features: ["Public profiles", "Project pages", "Tool attribution"],
  },
];

const StickyCard = ({
  i,
  useCase,
  progress,
  range,
  targetScale,
}: {
  i: number;
  useCase: typeof USE_CASES[0];
  progress: any;
  range: [number, number];
  targetScale: number;
}) => {
  const container = useRef<HTMLDivElement>(null);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className="sticky top-0 flex items-center justify-center h-screen"
    >
      <motion.div
        style={{
          scale,
          top: `calc(-50% + ${i * 25 + 200}px)`,
        }}
        className="rounded-t-lg relative origin-center w-full max-w-md mx-auto overflow-hidden shadow-lg"
      >
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-t-lg overflow-hidden group cursor-pointer"
        >
          {/* File Header */}
          <div className="bg-[var(--bg)] border-b border-[var(--border)] px-3 py-2 flex items-center gap-2">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <FileCode className="w-3.5 h-3.5 text-[var(--text-muted)] flex-shrink-0" />
              <span className="text-xs text-[var(--text-muted)] font-mono truncate">
                {useCase.title.toLowerCase().replace(/\s+/g, '-')}.md
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500/60"></div>
              <div className="w-2 h-2 rounded-full bg-green-500/60"></div>
              <button className="w-3.5 h-3.5 flex items-center justify-center rounded hover:bg-[var(--border)] transition-colors opacity-0 group-hover:opacity-100">
                <X className="w-2.5 h-2.5 text-[var(--text-muted)]" />
              </button>
            </div>
          </div>
          
          {/* Card Content */}
          <div className="p-6 hover:bg-[var(--bg)] transition">
            <div className="text-[var(--primary)] mb-4 group-hover:scale-110 transition-transform">
              {useCase.icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{useCase.title}</h3>
            <p className="text-[var(--text-muted)] mb-4 text-sm leading-relaxed">
              {useCase.description}
            </p>
            <ul className="space-y-2">
              {useCase.features.map((feature, idx) => (
                <li key={idx} className="text-sm text-[var(--text-muted)] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default function UseCaseStacking() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  // Initialize Lenis for smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <section className="relative mt-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Built For Every Developer</h2>
        <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
          Whether you're documenting, exploring, or building—Stackboxd fits your workflow
        </p>
      </div>

      <main
        ref={container}
        className="relative flex w-full flex-col items-center justify-center pb-[100vh] pt-32"
      >
        {/* <div className="absolute left-1/2 top-24 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center z-10 pointer-events-none">
          <span className="relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-[var(--border)] after:to-transparent after:content-['']">
            scroll down to see cards stack
          </span>
        </div> */}

        {USE_CASES.map((useCase, i) => {
          const targetScale = Math.max(
            0.7,
            1 - (USE_CASES.length - i - 1) * 0.08,
          );

          return (
            <StickyCard
              key={`useCase_${i}`}
              i={i}
              useCase={useCase}
              progress={scrollYProgress}
              range={[i * 0.15, 1]}
              targetScale={targetScale}
            />
          );
        })}
      </main>
    </section>
  );
}
