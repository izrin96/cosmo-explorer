import { CosmoPublicUser } from "@/lib/universal/cosmo/auth";
import { fetchByNickname } from "./cosmo/auth";
import { isAddress } from "viem";
import { notFound } from "next/navigation";

/**
 * Fetch a profile by various identifiers.
 */
export async function fetchUserByIdentifier(
    identifier: string,
    token: string
): Promise<CosmoPublicUser> {
    const identifierIsAddress = isAddress(identifier);

    // if no profile and it's an address, return it
    if (identifierIsAddress) {
        return {
            address: identifier,
            nickname: identifier.substring(0, 6),
            profileImageUrl: '',
            profile: []
        };
    }

    // fall back to cosmo
    const user = await fetchByNickname(token, identifier);
    if (!user) {
        notFound();
    }

    return user
}
