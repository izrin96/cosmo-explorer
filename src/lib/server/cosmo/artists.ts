import "server-only";
import { CosmoArtistWithMembers } from "@/lib/universal/cosmo/artists";
import { ValidArtist, validArtists } from "@/lib/universal/cosmo/common";
import { cosmo } from "../http";

/**
 * Fetch a single artist with its members.
 * Cached for 12 hours.
 */
export async function fetchArtist(artist: ValidArtist) {
  return await cosmo<{ artist: CosmoArtistWithMembers }>(
    `/artist/v1/${artist}`,
    {
      next: {
        revalidate: 60 * 60 * 12,
      },
    }
  ).then((res) => res.artist);
}

/**
 * Fetch all artists with their members.
 * Cached for 12 hours.
 */
export const fetchArtistsWithMembers = async () => {
  return await Promise.all(validArtists.map((artist) => fetchArtist(artist)));
};
