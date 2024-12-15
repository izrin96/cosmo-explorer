import { fetchUserByIdentifier } from "@/lib/server/auth";
import { cache } from "react";

/**
 * Fetch a user by nickname or address.
 */
export const getUserByIdentifier = cache(async (identifier: string) => {
  return await fetchUserByIdentifier(identifier);
});
