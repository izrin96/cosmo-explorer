import { isServer } from "@tanstack/react-query";
import { type ClassValue, clsx } from "clsx";
import { env } from "@/env.mjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type PropsWithClassName<T> = T & { className?: string };

/**
 * default grid columns
 */
export const GRID_COLUMNS = 7;
export const GRID_COLUMNS_MOBILE = 3;

export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

export const APOLLO_ENDPOINT = "https://apollo.cafe";

export function baseUrl() {
  if (!isServer) {
    return ''
  }
  if (env.NEXT_PUBLIC_URL) {
    return `${env.NEXT_PUBLIC_URL}`
  }
  const scheme = env.NEXT_PUBLIC_VERCEL_ENV === "development" ? "http" : "https";
  if (env.NEXT_PUBLIC_VERCEL_URL) {
    return `${scheme}://${env.NEXT_PUBLIC_VERCEL_URL}`
  }
  return 'http://localhost:3000'
}