import type { Metadata } from "next";
import localFont from "next/font/local";
import ClientProviders from "./client-providers";
import { Toast } from "@/components/ui";
import Navbar from "@/components/navbar/navbar";
import { Suspense } from "react";

import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-mono",
  weight: "100 900",
});
const dotMatrix = localFont({
  src: "./fonts/dot_matrix.woff2",
  variable: "--font-dotmatrix",
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    template: "%s · Lunar Cosmo",
    default: "Lunar Cosmo",
    absolute: "Lunar Cosmo",
  },
  description: "Another Cosmo objekts explorer",
  keywords: [
    "kpop",
    "korea",
    "modhaus",
    "모드하우스",
    "cosmo",
    "objekt",
    "tripleS",
    "트리플에스",
    "artms",
    "artemis",
    "아르테미스",
    "아르테미스 스트래티지",
    "odd eye circle",
    "오드아이써클",
    "loona",
    "이달의 소녀",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dotMatrix.variable} antialiased font-sans`}
      >
        <Suspense>
          <ClientProviders>
            <div className="relative flex min-h-dvh flex-col">
              <Navbar />
              <main className="flex min-w-full flex-col items-center">
                {children}
              </main>
            </div>
          </ClientProviders>
          <Toast />
        </Suspense>
      </body>
    </html>
  );
}
