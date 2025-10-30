"use client";

import { useState } from "react";

export default function OnboardingPage() {
  const [languages, setLanguages] = useState<string[]>([]);
  const options = ["JavaScript", "TypeScript", "Go", "Python", "Rust"];
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-xl font-semibold">Start your stack</h1>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="mb-3 text-sm uppercase tracking-wide text-[var(--text-muted)]">Select favorite languages</h2>
        <div className="flex flex-wrap gap-2">
          {options.map((o) => (
            <button
              key={o}
              onClick={() => setLanguages((prev) => prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o])}
              className={`rounded-full border px-3 py-1 text-sm ${languages.includes(o) ? "border-[var(--primary)] text-[var(--primary)]" : "border-[var(--border)] text-[var(--text-muted)]"}`}
            >
              {o}
            </button>
          ))}
        </div>
        <div className="mt-6 text-right">
          <button className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-medium text-black shadow-[0_0_0_1px_#00FF8F40,_0_8px_30px_rgba(0,0,0,0.6)]">Continue</button>
        </div>
      </div>
    </div>
  );
}


