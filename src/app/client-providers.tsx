"use client";

import { useRouter } from "next/navigation";
import { getQueryClient } from "@/lib/query-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { PropsWithChildren } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { MediaQueryProvider } from "@/hooks/use-media-query";
import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import { RouterProvider } from "react-aria-components";

type Props = PropsWithChildren;

declare module "react-aria-components" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export default function ClientProviders({ children }: Props) {
  const queryClient = getQueryClient();
  const router = useRouter();

  return (
    <RouterProvider navigate={router.push}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <NextTopLoader
          color="var(--primary)"
          height={2}
          showSpinner={false}
        />
        <NuqsAdapter>
          <QueryClientProvider client={queryClient}>
            <MediaQueryProvider>{children}</MediaQueryProvider>
            <ReactQueryDevtools />
          </QueryClientProvider>
        </NuqsAdapter>
      </ThemeProvider>
    </RouterProvider>
  );
}
