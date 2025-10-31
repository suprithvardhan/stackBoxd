"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { House, Compass, List, Briefcase, PlusCircle, Search } from "lucide-react"
import { motion } from "framer-motion"
import { signOut, useSession } from "next-auth/react"

const tabs = [
  { href: "/home", label: "Home", icon: House },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/lists", label: "Lists", icon: List },
  { href: "/projects", label: "Projects", icon: Briefcase },
]

export function SiteNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()
  const isAuthed = status === "authenticated"

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" })
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[color:var(--bg)/0.8] backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Stackboxd
        </Link>
        <nav className="hidden gap-1 md:flex">
          {tabs.map((t) => {
            const Icon = t.icon
            const active = pathname === t.href || pathname.startsWith(t.href + "/")
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`group relative inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active ? "text-[var(--text)]" : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                <Icon size={18} />
                <span>{t.label}</span>
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-lg"
                    style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.06) inset" }}
                  />
                )}
              </Link>
            )
          })}
        </nav>
        <div className="flex items-center gap-2">
          <button className="hidden items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-muted)] transition hover:text-[var(--text)] md:inline-flex">
            <Search size={16} />
            <span>Search…</span>
            <kbd className="ml-1 rounded bg-black/40 px-1.5 py-0.5 text-[10px] text-[var(--text-muted)]">⌘K</kbd>
          </button>
          {isAuthed && session?.user ? (
            <>
              <Link
                href="/log/new"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-medium text-black shadow-[0_0_0_1px_#00FF8F40,_0_8px_30px_rgba(0,0,0,0.6)] transition hover:opacity-90 focus:outline-none focus:ring-2"
                style={{ outlineColor: "var(--ring)" }}
              >
                <PlusCircle size={18} />
                Log Tool
              </Link>
              <button
                onClick={handleLogout}
                className="ml-2 rounded-full border border-[var(--border)] px-3 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                Logout
              </button>
              <Link
                href={`/profile/${(session.user as any).username || session.user.name?.toLowerCase().replace(/\s+/g, "") || "user"}`}
                className="ml-2 h-8 w-8 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center overflow-hidden hover:outline hover:outline-[2.5px] hover:outline-[var(--primary)] transition"
              >
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={32}
                    height={32}
                    className="rounded-full object-cover w-8 h-8"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-black text-xs font-semibold">
                    {(session.user.name || session.user.email || "U")[0].toUpperCase()}
                  </div>
                )}
              </Link>
            </>
          ) : (
            <Link href="/login" className="rounded-full border border-[var(--border)] px-4 py-2 text-sm">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
