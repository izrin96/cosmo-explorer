import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { validateExpiry } from "./lib/server/jwt";
import { fetchAccessToken, updateAccessToken } from "./lib/server/token";
import { refresh } from "./lib/server/cosmo/auth";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}

export async function middleware(request: NextRequest) {
  const accessToken = await fetchAccessToken();

  try {
    if (validateExpiry(accessToken.accessToken) === false) {
      if (validateExpiry(accessToken.refreshToken)) {
        const newTokens = await refresh(accessToken.refreshToken);
        await updateAccessToken(newTokens);
      }
    }
  } catch {}

  return NextResponse.next();
}
