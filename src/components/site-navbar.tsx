"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { House, Compass, List, Briefcase, PlusCircle, Search, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { signOut, useSession } from "next-auth/react"
import { SearchModal } from "./search-modal"

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
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" })
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[color:var(--bg)/0.8] backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3">
          <Link href="/home" className="text-lg font-semibold tracking-tight">
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
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-muted)] transition hover:text-[var(--text)] md:inline-flex"
            >
              <Search size={16} />
              <span className="hidden lg:inline">Search…</span>
              <kbd className="ml-1 hidden lg:inline rounded bg-black/40 px-1.5 py-0.5 text-[10px] text-[var(--text-muted)]">⌘K</kbd>
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] transition"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
            {isAuthed && session?.user ? (
              <>
                <Link
                  href="/log/new"
                  className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-medium text-black shadow-[0_0_0_1px_#00FF8F40,_0_8px_30px_rgba(0,0,0,0.6)] transition hover:opacity-90 focus:outline-none focus:ring-2 min-h-[44px]"
                  style={{ outlineColor: "var(--ring)" }}
                >
                  <PlusCircle size={18} />
                  <span className="hidden md:inline">Log Tool</span>
                </Link>
                <Link
                  href="/log/new"
                  className="sm:hidden p-2.5 rounded-full bg-[var(--primary)] text-black min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Log Tool"
                >
                  <PlusCircle size={20} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden sm:block ml-2 rounded-full border border-[var(--border)] px-3 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] min-h-[44px]"
                >
                  Logout
                </button>
                <Link
                  href={`/profile/${(session.user as any).username || session.user.name?.toLowerCase().replace(/\s+/g, "") || "user"}`}
                  className="ml-2 h-10 w-10 sm:h-8 sm:w-8 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center overflow-hidden hover:outline hover:outline-[2.5px] hover:outline-[var(--primary)] transition"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={40}
                      height={40}
                      className="rounded-full object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-[var(--primary)] flex items-center justify-center text-black text-xs font-semibold">
                      {(session.user.name || session.user.email || "U")[0].toUpperCase()}
                    </div>
                  )}
                </Link>
              </>
            ) : (
              <Link href="/login" className="rounded-full border border-[var(--border)] px-4 py-2 text-sm min-h-[44px] flex items-center">
                Sign In
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden ml-2 p-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--bg)] transition min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-[57px] right-0 bottom-0 w-[280px] max-w-[85vw] bg-[var(--surface)] border-l border-[var(--border)] z-50 md:hidden overflow-y-auto"
            >
              <div className="p-4 space-y-1">
                {tabs.map((t) => {
                  const Icon = t.icon
                  const active = pathname === t.href || pathname.startsWith(t.href + "/")
                  return (
                    <Link
                      key={t.href}
                      href={t.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-base transition-colors min-h-[48px] ${
                        active 
                          ? "bg-[var(--primary)]/10 text-[var(--primary)] font-semibold border-l-2 border-[var(--primary)]" 
                          : "text-[var(--text-muted)] hover:bg-[var(--bg)] hover:text-[var(--text)]"
                      }`}
                    >
                      <Icon size={20} />
                      <span>{t.label}</span>
                    </Link>
                  )
                })}
                {isAuthed && session?.user && (
                  <>
                    <div className="border-t border-[var(--border)] my-2" />
                    <Link
                      href="/log/new"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-base bg-[var(--primary)] text-black font-semibold min-h-[48px]"
                    >
                      <PlusCircle size={20} />
                      <span>Log Tool</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setMobileMenuOpen(false)
                      }}
                      className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-base text-[var(--text-muted)] hover:bg-[var(--bg)] hover:text-[var(--text)] transition-colors min-h-[48px] text-left"
                    >
                      <span>Logout</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
