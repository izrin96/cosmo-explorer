import {
  ValidClass,
  validClasses,
  validOnlineTypes,
  ValidSeason,
  validSeasons,
  ValidOnlineType,
  ValidArtist,
  validArtists,
  ValidSort,
  validSorts
} from "@/lib/universal/cosmo/common";
import {
  parseAsArrayOf,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
  parseAsBoolean,
} from "nuqs";

export function useCosmoFilters() {
  return useQueryStates({
    member: parseAsString,
    artist: parseAsStringEnum<ValidArtist>(Object.values(validArtists)),
    sort: parseAsStringEnum<ValidSort>(Object.values(validSorts)),
    class: parseAsArrayOf(
      parseAsStringEnum<ValidClass>(Object.values(validClasses))
    ),
    season: parseAsArrayOf(
      parseAsStringEnum<ValidSeason>(Object.values(validSeasons))
    ),
    on_offline: parseAsArrayOf(
      parseAsStringEnum<ValidOnlineType>(Object.values(validOnlineTypes))
    ),
    transferable: parseAsBoolean,
    gridable: parseAsBoolean,
    used_for_grid: parseAsBoolean,
    // grid param: "Atom01 JinSoul 101Z"
    collection: parseAsString,
    // index param: ["101Z", "102Z"]
    collectionNo: parseAsArrayOf(parseAsString),
    grouped: parseAsBoolean
  });
}

type UseCosmoFiltersReturnType = ReturnType<typeof useCosmoFilters>;
export type CosmoFilters = UseCosmoFiltersReturnType[0];
export type SetCosmoFilters = UseCosmoFiltersReturnType[1];
export type PropsWithFilters<T extends keyof CosmoFilters> = {
  filters: CosmoFilters[T];
  setFilters: SetCosmoFilters;
};
