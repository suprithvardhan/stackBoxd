"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { api } from "@/lib/api";

export function useAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page view
    if (pathname && pathname !== "/admin" && !pathname.startsWith("/admin")) {
      api.analytics.track("page_view", {}, pathname, document.referrer).catch(() => {
        // Silent fail - analytics should not break the app
      });
    }
  }, [pathname]);

  return {
    track: (eventType: string, eventData?: any) => {
      api.analytics.track(eventType, eventData, pathname, document.referrer).catch(() => {
        // Silent fail
      });
    },
  };
}

