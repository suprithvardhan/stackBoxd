"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache for 5 minutes by default
            staleTime: 5 * 60 * 1000, // 5 minutes
            // Keep data in cache for 10 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
            // Retry failed requests once
            retry: 1,
            // Refetch on window focus only for critical data
            refetchOnWindowFocus: false,
            // Don't refetch on reconnect automatically
            refetchOnReconnect: false,
          },
          mutations: {
            // Retry mutations once
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

