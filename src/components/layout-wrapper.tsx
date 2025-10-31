"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { LandingNavbar } from "@/components/landing-navbar";
import { SiteNavbar } from "@/components/site-navbar";
import { AuthProvider } from "./auth-provider";

export function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  return (
    <AuthProvider>
      {isLanding ? <LandingNavbar /> : <SiteNavbar />}
      <main className="flex-1 w-full mx-auto max-w-7xl px-4 py-6 flex flex-col gap-6">{children}</main>
    </AuthProvider>
  );
}
