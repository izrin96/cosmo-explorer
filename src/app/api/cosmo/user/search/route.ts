import { env } from "@/env.mjs"
import { search } from "@/lib/server/cosmo/auth"
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const result = await search(env.COSMO_ACCESS_TOKEN, searchParams.get('query') ?? '')

  return Response.json(result)
}
