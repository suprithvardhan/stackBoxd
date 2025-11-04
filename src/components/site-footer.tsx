export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] w-full min-h-16 flex items-center">
      <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between px-4 sm:px-6 md:px-8 py-4 sm:py-6 w-full text-xs sm:text-sm text-[var(--text-muted)] gap-4 sm:gap-0">
        <p>© {new Date().getFullYear()} Stackboxd</p>
        <nav className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <a className="hover:text-[var(--text)] transition min-h-[44px] flex items-center" href="/discover">Discover</a>
          <a className="hover:text-[var(--text)] transition min-h-[44px] flex items-center" href="/lists">Lists</a>
          <a className="hover:text-[var(--text)] transition min-h-[44px] flex items-center" href="/settings">Settings</a>
        </nav>
      </div>
    </footer>
  );
}


