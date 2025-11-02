export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-xl font-semibold">Settings</h1>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-[var(--text-muted)]">Display name</label>
            <input className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 outline-none focus:ring-2" style={{ outlineColor: "var(--ring)" }} placeholder="Velt Cipher" />
          </div>
          <div>
            <label className="text-sm text-[var(--text-muted)]">Bio</label>
            <textarea className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 outline-none focus:ring-2" rows={4} placeholder="Forever debugging life and code." style={{ outlineColor: "var(--ring)" }} />
          </div>
          <div className="text-right">
            <button className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-medium text-black shadow-[0_0_0_1px_#00FF8F40,_0_8px_30px_rgba(0,0,0,0.6)]">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}


