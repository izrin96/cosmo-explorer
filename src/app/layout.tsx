import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import ClientProviders from "./client-providers";
import { Toast } from "@/components/ui/toast";
import Navbar from "@/components/navbar/navbar";
import NextTopLoader from "nextjs-toploader";

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

export const metadata: Metadata = {
  title: {
    template: "%s · Lunar Cosmo",
    default: "Lunar Cosmo",
    absolute: "Lunar Cosmo"
  },
  description: "Another Cosmo objekts explorer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <NextTopLoader color="hsl(var(--primary))" height={2} showSpinner={false} />
          <ClientProviders>
            <div className="relative flex min-h-dvh flex-col">
              <Navbar />
              <div className="flex min-w-full flex-col items-center">
                {children}
              </div>
            </div>
            <Toast />
          </ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
