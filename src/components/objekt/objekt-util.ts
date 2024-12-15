import { OwnedObjekt } from "@/lib/universal/cosmo/objekts";
import { ValidObjekt } from "@/lib/universal/objekts";

export type ValidObjektWithId = ValidObjekt & { collectionShortId: string };
export type OwnedObjektWithId = OwnedObjekt & { collectionShortId: string };

/**
 * Parse a valid key from an ambiguous objekt.
 */
export function getObjektId(objekt: ValidObjekt) {
  if ("objektNo" in objekt) {
    return objekt.objektNo.toString();
  }
  if ("id" in objekt) {
    return objekt.id;
  }

  throw new Error("Invalid objekt");
}

const map: Record<string, string> = {
  artms: "ARTMS",
  triples: "tripleS",
};

/**
 * Parse a valid artist from an ambiguous objekt.
 */
export function getObjektArtist(objekt: ValidObjekt) {
  if ("objektNo" in objekt) {
    return map[objekt.artists[0]!.toLowerCase()];
  }
  if ("id" in objekt) {
    return map[objekt.artist.toLowerCase()];
  }

  throw new Error("Invalid objekt");
}

/**
 * Parse a valid offline type from an ambiguous objekt.
 */
export function getObjektType(objekt: ValidObjekt) {
  if ("objektNo" in objekt) {
    return objekt.collectionNo.at(-1) === "Z" ? "online" : "offline";
  }
  if ("id" in objekt) {
    return objekt.onOffline;
  }

  throw new Error("Invalid objekt");
}
