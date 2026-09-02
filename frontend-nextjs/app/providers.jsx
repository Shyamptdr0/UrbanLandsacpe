"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";

import SelectionHoverFix from "@/components/SelectionHoverFix";

export default function Providers({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SelectionHoverFix />
        <Toaster position="top-right" richColors />
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}
