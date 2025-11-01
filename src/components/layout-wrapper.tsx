"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { LandingNavbar } from "@/components/landing-navbar";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import AuthProvider from "./auth-provider";
import { QueryProvider } from "./query-provider";

export function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const isAuthPage = pathname === "/login" || pathname === "/onboarding";
  
  return (
    <QueryProvider>
      <AuthProvider>
        {isLanding ? <LandingNavbar /> : !isAuthPage && <SiteNavbar />}
        <main className={`flex-1 w-full ${isAuthPage ? "" : "mx-auto max-w-7xl px-4 py-6"} flex flex-col gap-6`}>{children}</main>
        {!isAuthPage && <SiteFooter />}
      </AuthProvider>
    </QueryProvider>
  );
}
