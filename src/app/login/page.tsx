"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  return (
    <div className="mx-auto max-w-md space-y-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <h1 className="text-xl font-semibold">Login</h1>
      <div className="space-y-3">
        <button
          onClick={() => {
            login();
            router.replace("/home");
          }}
          className="w-full rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-medium text-black shadow-[0_0_0_1px_#00FF8F40,_0_8px_30px_rgba(0,0,0,0.6)]"
        >
          Continue (Mock)
        </button>
        <button className="w-full rounded-full border border-[var(--border)] px-4 py-2 text-sm">Continue with GitHub</button>
        <button className="w-full rounded-full border border-[var(--border)] px-4 py-2 text-sm">Continue with Google</button>
      </div>
    </div>
  );
}


