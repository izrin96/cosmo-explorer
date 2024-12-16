"use client";

import { getQueryClient } from "@/lib/query-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { PropsWithChildren } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { MediaQueryProvider } from "@/hooks/use-media-query";

type Props = PropsWithChildren;

export default function ClientProviders({ children }: Props) {
  const queryClient = getQueryClient();

  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <MediaQueryProvider>{children}</MediaQueryProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </NuqsAdapter>
  );
}
