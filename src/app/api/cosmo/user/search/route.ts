import { search } from "@/lib/server/cosmo/auth";
import { fetchAccessToken } from "@/lib/server/token";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const accessToken = await fetchAccessToken();
  const searchParams = request.nextUrl.searchParams;
  const result = await search(
    accessToken.accessToken,
    searchParams.get("query") ?? ""
  );

  return Response.json(result);
}
