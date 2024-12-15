import type { Collection } from "@/lib/server/db/indexer/schema";
import { ObjektMetadataEntry, Profile } from "@/lib/server/db/schema";
import { ObjektBaseFields, OwnedObjekt } from "@/lib/universal/cosmo/objekts";

export type IndexedObjekt = Collection;
export type IndexedCosmoResponse = {
  hasNext: boolean;
  total: number;
  nextStartAfter?: number;
  objekts: IndexedObjekt[];
};
export type ValidObjekt = ObjektBaseFields | OwnedObjekt | IndexedObjekt;
interface ObjektInformation extends ObjektMetadataEntry {
  profile?: Profile;
}
export type ObjektMetadata = {
  total: number;
  transferable: number;
  percentage: number;
  metadata: ObjektInformation | undefined;
};

/**
 * Parse a Cosmo-compatible objekts response.
 */
export function parsePage<T>(data: any) {
  return {
    ...data,
    nextStartAfter: data.nextStartAfter
      ? parseInt(data.nextStartAfter)
      : undefined,
  } as T;
}

export function getCollectionShortId(objekt: ValidObjekt) {
  return `${objekt.member} ${objekt.season.charAt(0)}${objekt.collectionNo}`
}