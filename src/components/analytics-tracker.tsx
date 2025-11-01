"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/analytics";

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page view on route change
    if (pathname && pathname !== "/admin" && !pathname.startsWith("/admin")) {
      trackPageView(pathname);
    }
  }, [pathname]);

  return null;
}

