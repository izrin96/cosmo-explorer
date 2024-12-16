import { env } from "@/env.mjs";
import { fetchUserByIdentifier } from "@/lib/server/auth";
import { fetchArtistsWithMembers } from "@/lib/server/cosmo/artists";
import { cache } from "react";

/**
 * Fetch a user by nickname or address.
 */
export const getUserByIdentifier = cache(async (identifier: string) => {
  return await fetchUserByIdentifier(identifier, env.COSMO_ACCESS_TOKEN);
});

/**
 * Fetch artists with all members from Cosmo.
 */
export const getArtistsWithMembers = cache(async () => {
  return await fetchArtistsWithMembers();
});
