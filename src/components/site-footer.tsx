export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] w-full min-h-16 flex items-center">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 md:px-8 py-6 w-full text-sm text-[var(--text-muted)]">
        <p>© {new Date().getFullYear()} Stackboxd</p>
        <nav className="flex gap-4">
          <a className="hover:text-[var(--text)]" href="/discover">Discover</a>
          <a className="hover:text-[var(--text)]" href="/lists">Lists</a>
          <a className="hover:text-[var(--text)]" href="/settings">Settings</a>
        </nav>
      </div>
    </footer>
  );
}


