import { RefreshTokenResult } from "./cosmo/auth";
import { db } from "./db";
import { accessToken } from "./db/schema";

async function getAccessToken() {
  const result = await db.query.accessToken.findFirst();
  if (!result)
    return {
      accessToken: "",
      refreshToken: "",
    };
  return result;
}

export async function fetchAccessToken() {
  return await getAccessToken();
}

export async function updateAccessToken(newToken: RefreshTokenResult) {
  await db.update(accessToken).set({
    accessToken: newToken.accessToken,
    refreshToken: newToken.refreshToken,
  });
}
