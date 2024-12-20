import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env = createEnv({
  server: {
    // ramper misc endpoint
    RAMPER_URL: z.string().url(),
    // ramper api endpoint
    RAMPER_API_URL: z.string().url(),
    // ramper app id for cosmo
    RAMPER_APP_ID: z.string(),
    // user agent to use when making requests to ramper
    RAMPER_USERAGENT: z.string(),
    // used for signing cookies
    JWT_SECRET: z.string(),
    // neon db
    DATABASE_URL: z.string(),
    // indexer db http proxy
    INDEXER_PROXY_KEY: z.string(),
    INDEXER_PROXY_URL: z.string(),
  },
  client: {
    NEXT_PUBLIC_URL: z.string().optional(),
    NEXT_PUBLIC_VERCEL_URL: z.string().optional(),
    NEXT_PUBLIC_VERCEL_ENV: z.string().optional(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
    NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
  }
});
