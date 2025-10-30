import Link from "next/link";
import { mockTools } from "@/lib/mock-data";
import { Icon } from "@iconify/react";
import LogoCollage from "@/components/hero-logo-collage";
import dynamic from "next/dynamic";
const LandingFeatures = dynamic(() => import("@/components/landing-features"));
const LandingActivity = dynamic(() => import("@/components/landing-activity"));
const LandingTestimonials = dynamic(() => import("@/components/landing-testimonials"));
const LandingStackCard = dynamic(() => import("@/components/landing-stack-card"));

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl min-h-[640px] flex flex-col gap-12">
      <section className="relative flex flex-col md:flex-row gap-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[linear-gradient(135deg,#0b0b0b,#101010)] p-10 min-h-[400px] md:min-h-[480px]">
        <div className="flex-1 flex flex-col items-start justify-center min-w-[240px]">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl leading-tight">Log, rate, and reflect on your developer stack</h1>
          <p className="mt-4 text-lg text-[var(--text-muted)] max-w-xl">Stackboxd makes exploring tools and documenting projects as engaging as Letterboxd—minimal, social, and beautiful.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/onboarding" className="rounded-full bg-[var(--primary)] px-6 py-2 text-base font-semibold text-black shadow-[0_0_4px_#00FF8F50] focus:outline-none focus:ring-2 ring-[var(--ring)] hover:bg-[var(--primary)]/90 transition">Get Started</Link>
            <Link href="/discover" className="rounded-full border border-[var(--border)] px-6 py-2 text-base">Discover</Link>
            <Link href="/login" className="rounded-full border border-[var(--primary)] bg-transparent px-6 py-2 text-base text-[var(--primary)] hover:bg-[var(--primary)]/[0.09]">Sign In</Link>
          </div>
        </div>
        {/* Right: Brand logo grid-cloud with Framer Motion */}
        <div className="relative flex-1 flex items-center justify-center min-h-[320px]">
          <LogoCollage />
        </div>
      </section>

      <LandingFeatures />
      <LandingActivity />
      <LandingTestimonials />
      <LandingStackCard />

      <section className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        <FeatureCard title="Log tools like reviews" desc="Rate tools with stars and write reflections as you would reviews." />
        <FeatureCard title="Project-first" desc="Link logs to projects and show your stack with context." />
        <FeatureCard title="Social by default" desc="Follow developers, like, comment, and curate lists." />
      </section>

      <section className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
        <h2 className="text-xl font-semibold">What developers are saying</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Quote text="Finally journaling my tooling choices. Makes retros easy and fun." author="@rhea" />
          <Quote text="Like Letterboxd but for code. The lists are my favorite." author="@ben" />
          <Quote text="Helps me remember why I picked certain libraries months later." author="@mike" />
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-[var(--border)] bg-[linear-gradient(135deg,#0c0c0c,#131313)] p-8 text-center">
        <h2 className="text-2xl font-semibold">Ready to build your Stack Card?</h2>
        <p className="mt-2 text-[var(--text-muted)]">Summarize your year in tech and share it anywhere.</p>
        <div className="mt-6">
          <Link href="/stack-card" className="rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-black shadow-[0_0_0_1px_#00FF8F40,_0_8px_30px_rgba(0,0,0,0.6)]">Create your Stack Card</Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <h3 className="font-medium">{title}</h3>
      <p className="mt-2 text-[var(--text-muted)]">{desc}</p>
    </div>
  );
}

function Quote({ text, author }: { text: string; author: string }) {
  return (
    <blockquote className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 font-serif text-[var(--text-muted)]">
      “{text}”
      <div className="mt-2 text-sm not-italic text-[var(--text)]">— {author}</div>
    </blockquote>
  );
}
