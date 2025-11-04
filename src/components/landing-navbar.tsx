import Link from "next/link";

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-b from-black/80 via-zinc-950/70 to-transparent backdrop-blur-md shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 md:px-8 py-3 sm:py-4">
        <Link href="/" className="font-bold text-base sm:text-lg tracking-tight text-[var(--primary)]">Stackboxd</Link>
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <Link href="/login" className="rounded-md px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base text-[var(--text-muted)] hover:text-[var(--primary)] transition min-h-[44px] flex items-center">Sign In</Link>
          <Link href="/home" className="rounded-full bg-[var(--primary)] px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-black focus:outline-none focus:ring-2 ring-[var(--ring)] hover:bg-[var(--primary)]/90 transition-all duration-300 hover:scale-105 shadow-[0_2px_6px_rgba(0,255,143,0.12),0_1px_2px_rgba(0,0,0,0.15)] min-h-[44px] flex items-center">Start Logging</Link>
        </div>
      </nav>
    </header>
  );
}
