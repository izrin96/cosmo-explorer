import { fetchUserByIdentifier } from "@/lib/server/auth";
import { fetchArtistBff } from "@/lib/server/cosmo/artists";
import { fetchAccessToken } from "@/lib/server/token";
import { validArtists } from "@/lib/universal/cosmo/common";
import { cache } from "react";
import { getUser } from "./api/common";

/**
 * Decode the current token.
 */
export const decodeUser = cache(async () => {
  const auth = await getUser();
  return auth.success ? auth.user : undefined;
});

/**
 * Fetch a user by nickname or address.
 */
export const getUserByIdentifier = cache(async (identifier: string) => {
  const accessToken = await fetchAccessToken();
  return await fetchUserByIdentifier(identifier, accessToken.accessToken);
});

/**
 * Fetch artists with all members from Cosmo.
 */
export const getArtistsWithMembers = cache(async () => {
  return await Promise.all(
    validArtists.map((artist) => fetchArtistBff(artist))
  );
});
