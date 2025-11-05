import Link from "next/link";
import { Icon } from "@iconify/react";
import LogoCollage from "@/components/hero-logo-collage";
import dynamic from "next/dynamic";
import { TrendingUp, Users, Code, BookOpen } from "lucide-react";
import Script from "next/script";
import type { Metadata } from "next";

const LandingFeatures = dynamic(() => import("@/components/landing-features"));
const LandingActivity = dynamic(() => import("@/components/landing-activity"));
const LandingTestimonials = dynamic(() => import("@/components/landing-testimonials"));
const LandingStackCard = dynamic(() => import("@/components/landing-stack-card"));
const LandingSponsors = dynamic(() => import("@/components/landing-sponsors"));
const UseCaseStacking = dynamic(() => import("@/components/use-case-stacking"));

export default function Home() {
  const baseUrl = process.env.NEXTAUTH_URL || "https://stackboxd.vercel.app";

  // Generate comprehensive structured data for SEO (server-side)
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "StackBoxd",
    alternateName: "StackBoxd - Developer Stack Platform",
    url: baseUrl,
    description: "StackBoxd is the social platform for developers to log, rate, and reflect on their developer stack. Discover tools, share projects, and build your developer portfolio.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/discover?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "StackBoxd",
    alternateName: "StackBoxd Platform",
    url: baseUrl,
    logo: `${baseUrl}/icon.svg`,
    description: "StackBoxd is the social platform for developers to log, rate, and reflect on their developer stack. Think Letterboxd, but for your tech stack.",
    sameAs: [
      "https://github.com/suprithv/stackboxd",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      url: baseUrl,
    },
  };

  const softwareApplicationStructuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "StackBoxd",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "100",
    },
    description: "StackBoxd is the social platform for developers to log, rate, and reflect on their developer stack. Discover tools, share projects, and build your developer portfolio.",
    url: baseUrl,
    author: {
      "@type": "Organization",
      name: "StackBoxd Team",
    },
  };

  return (
    <>
      <Script
        id="website-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
      />
      <Script
        id="organization-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
      />
      <Script
        id="software-application-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationStructuredData) }}
      />
      <div className="mx-auto max-w-7xl min-h-[640px] flex flex-col gap-12 sm:gap-16 px-4 sm:px-6">
      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row gap-6 md:gap-8 overflow-hidden rounded-2xl md:rounded-3xl border border-[var(--border)] bg-[linear-gradient(135deg,#0b0b0b,#101010)] p-6 sm:p-8 md:p-10 lg:p-12 min-h-[400px] sm:min-h-[450px] md:min-h-[500px]">
        <div className="flex-1 flex flex-col items-start justify-center min-w-0 z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">Log, rate, and reflect on your developer stack</h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-[var(--text-muted)] max-w-xl">StackBoxd makes exploring tools and documenting projects as engaging as Letterboxd—minimal, social, and beautiful. StackBoxd is the leading platform for developers to track, review, and share their tech stack.</p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3 w-full sm:w-auto">
            <Link href="/home" className="w-full sm:w-auto rounded-full bg-[var(--primary)] px-6 sm:px-8 py-3 text-sm sm:text-base font-semibold text-black focus:outline-none focus:ring-2 ring-[var(--ring)] hover:bg-[var(--primary)]/90 transition-all duration-300 hover:scale-105 shadow-[0_2px_8px_rgba(0,255,143,0.15),0_1px_3px_rgba(0,0,0,0.2)] text-center min-h-[48px] flex items-center justify-center">Start Logging Tools</Link>
            <Link href="/discover" className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full border-2 border-[var(--border)] bg-[var(--surface)] px-6 sm:px-8 py-3 text-sm sm:text-base font-medium hover:bg-[var(--bg)] hover:border-[var(--text-muted)] transition min-h-[48px]">
              <Icon icon="lucide:compass" width={18} height={18} />
              <span>Discover Tools</span>
            </Link>
          </div>
        </div>
        <div className="relative flex-1 flex items-center justify-center min-h-[280px] sm:min-h-[320px] md:min-h-[400px] -mx-4 sm:mx-0">
          <LogoCollage />
        </div>
      </section>

      {/* Stats Section - Bento Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={<Users className="w-5 h-5 sm:w-6 sm:h-6" />} value="2.5K+" label="Active Developers" color="text-blue-400" />
        <StatCard icon={<Code className="w-5 h-5 sm:w-6 sm:h-6" />} value="50K+" label="Tools Logged" color="text-purple-400" />
        <StatCard icon={<BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />} value="15K+" label="Projects Shared" color="text-green-400" />
        <StatCard icon={<TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />} value="8.2K" label="Daily Logs" color="text-orange-400" />
      </section>

      <LandingFeatures />
      <LandingActivity />
      <LandingTestimonials />

      <UseCaseStacking />

      <LandingStackCard />
      <LandingSponsors />

      {/* Final CTA */}
      <section className="mt-6 sm:mt-8 rounded-2xl md:rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[#00FF8F]/10 via-[#00FF8F]/5 to-transparent p-6 sm:p-8 md:p-12 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4">Ready to start your developer journal with StackBoxd?</h2>
        <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-2xl mx-auto mb-6 sm:mb-8">Join thousands of developers on StackBoxd documenting their stack, one tool at a time. Start using StackBoxd today!</p>
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
          <Link href="/home" className="w-full sm:w-auto rounded-full bg-[var(--primary)] px-6 sm:px-8 py-3 text-sm sm:text-base font-semibold text-black hover:bg-[var(--primary)]/90 transition-all duration-300 hover:scale-105 shadow-[0_2px_8px_rgba(0,255,143,0.15),0_1px_3px_rgba(0,0,0,0.2)] min-h-[48px] flex items-center justify-center">Start Logging Your Stack</Link>
          <Link href="/discover" className="w-full sm:w-auto rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 sm:px-8 py-3 text-sm sm:text-base hover:bg-[var(--bg)] transition min-h-[48px] flex items-center justify-center">Explore Community</Link>
        </div>
      </section>

      {/* Open Source Section */}
      <section className="mt-6 sm:mt-8 rounded-2xl md:rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] p-6 sm:p-8 md:p-10 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-2 sm:mb-3">Built by developers, for developers</h2>
          <p className="text-base sm:text-lg text-[var(--text-muted)] mb-4 sm:mb-6">
            StackBoxd is completely open source. Want to contribute? Check out our repository and help shape the future of developer tool documentation. StackBoxd is free and open for all developers.
          </p>
          <a 
            href="https://github.com/suprithv/stackboxd" 
            target="_blank" 
            rel="noopener"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base hover:bg-[var(--bg)] transition hover:scale-105 group min-h-[48px]"
          >
            <Icon icon="simple-icons:github" width={18} height={18} className="sm:w-5 sm:h-5 text-[var(--text)]" />
            <span>View on GitHub</span>
            <Icon icon="lucide:external-link" width={14} height={14} className="sm:w-4 sm:h-4 text-[var(--text-muted)] group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>
    </div>
    </>
  );
}

function StatCard({ icon, value, label, color }: { icon: React.ReactNode; value: string; label: string; color: string }) {
  return (
    <div className="rounded-xl sm:rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6 hover:bg-[var(--bg)] transition group">
      <div className={`${color} mb-2 sm:mb-3 group-hover:scale-110 transition-transform`}>{icon}</div>
      <div className="text-2xl sm:text-3xl font-bold mb-1">{value}</div>
      <div className="text-xs sm:text-sm text-[var(--text-muted)]">{label}</div>
    </div>
  );
}

