import Link from "next/link";
import { Icon } from "@iconify/react";
import LogoCollage from "@/components/hero-logo-collage";
import dynamic from "next/dynamic";
import { TrendingUp, Users, Code, BookOpen } from "lucide-react";

const LandingFeatures = dynamic(() => import("@/components/landing-features"));
const LandingActivity = dynamic(() => import("@/components/landing-activity"));
const LandingTestimonials = dynamic(() => import("@/components/landing-testimonials"));
const LandingStackCard = dynamic(() => import("@/components/landing-stack-card"));
const LandingSponsors = dynamic(() => import("@/components/landing-sponsors"));
const UseCaseStacking = dynamic(() => import("@/components/use-case-stacking"));

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl min-h-[640px] flex flex-col gap-16 px-4">
      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row gap-8 overflow-hidden rounded-3xl border border-[var(--border)] bg-[linear-gradient(135deg,#0b0b0b,#101010)] p-10 md:p-12 min-h-[400px] md:min-h-[500px]">
        <div className="flex-1 flex flex-col items-start justify-center min-w-[240px] z-10">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl leading-tight">Log, rate, and reflect on your developer stack</h1>
          <p className="mt-4 text-lg md:text-xl text-[var(--text-muted)] max-w-xl">Stackboxd makes exploring tools and documenting projects as engaging as Letterboxd—minimal, social, and beautiful.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/onboarding" className="rounded-full bg-[var(--primary)] px-8 py-3 text-base font-semibold text-black shadow-[0_0_8px_#00FF8F50] focus:outline-none focus:ring-2 ring-[var(--ring)] hover:bg-[var(--primary)]/90 transition hover:scale-105">Get Started</Link>
            <Link href="/discover" className="rounded-full border border-[var(--border)] px-8 py-3 text-base hover:bg-[var(--surface)] transition">Discover</Link>
            <Link href="/login" className="rounded-full border border-[var(--primary)] bg-transparent px-8 py-3 text-base text-[var(--primary)] hover:bg-[var(--primary)]/[0.09] transition">Sign In</Link>
          </div>
        </div>
        <div className="relative flex-1 flex items-center justify-center min-h-[320px]">
          <LogoCollage />
        </div>
      </section>

      {/* Stats Section - Bento Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Users className="w-6 h-6" />} value="2.5K+" label="Active Developers" color="text-blue-400" />
        <StatCard icon={<Code className="w-6 h-6" />} value="50K+" label="Tools Logged" color="text-purple-400" />
        <StatCard icon={<BookOpen className="w-6 h-6" />} value="15K+" label="Projects Shared" color="text-green-400" />
        <StatCard icon={<TrendingUp className="w-6 h-6" />} value="8.2K" label="Daily Logs" color="text-orange-400" />
      </section>

      <LandingFeatures />
      <LandingActivity />
      <LandingTestimonials />

      <UseCaseStacking />

      <LandingStackCard />
      <LandingSponsors />

      {/* Final CTA */}
      <section className="mt-8 rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[#00FF8F]/10 via-[#00FF8F]/5 to-transparent p-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Ready to start your developer journal?</h2>
        <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto mb-8">Join thousands of developers documenting their stack, one tool at a time.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/onboarding" className="rounded-full bg-[var(--primary)] px-8 py-3 text-base font-semibold text-black shadow-[0_0_8px_#00FF8F50] hover:bg-[var(--primary)]/90 transition hover:scale-105">Get Started Free</Link>
          <Link href="/discover" className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-8 py-3 text-base hover:bg-[var(--bg)] transition">Explore Community</Link>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, value, label, color }: { icon: React.ReactNode; value: string; label: string; color: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 hover:bg-[var(--bg)] transition group">
      <div className={`${color} mb-3 group-hover:scale-110 transition-transform`}>{icon}</div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm text-[var(--text-muted)]">{label}</div>
    </div>
  );
}

