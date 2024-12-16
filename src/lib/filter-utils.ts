import { CosmoFilters } from "@/hooks/use-cosmo-filters";
import { ValidClass, ValidSeason } from "@/lib/universal/cosmo/common";
import { getCollectionShortId, IndexedObjekt } from "./universal/objekts";
import { OwnedObjekt } from "./universal/cosmo/objekts";

export function filterObjektsIndexed(
  filters: CosmoFilters,
  objekts: IndexedObjekt[]
) {
  let filteredObjekts = [...objekts];

  if (filters.member) {
    filteredObjekts = filteredObjekts.filter(
      (a) => a.member === filters.member
    );
  }
  if (filters.artist) {
    filteredObjekts = filteredObjekts.filter(
      (a) => a.artist === filters.artist
    );
  }
  if (filters.class) {
    filteredObjekts = filteredObjekts.filter((a) =>
      filters.class?.includes(a.class as ValidClass)
    );
  }
  if (filters.season) {
    filteredObjekts = filteredObjekts.filter((a) =>
      filters.season?.includes(a.season as ValidSeason)
    );
  }
  if (filters.on_offline) {
    filteredObjekts = filteredObjekts.filter((a) =>
      filters.on_offline?.includes(a.onOffline)
    );
  }

  const collectionNo = filters.collection ?? "";
  if (collectionNo) {
    filteredObjekts = filteredObjekts.filter((objekt) =>
      getCollectionShortId(objekt)
        ?.toLowerCase()
        ?.includes(collectionNo.toLowerCase())
    );
  }

  const sort = filters.sort ?? "newest";
  switch (sort) {
    case "newest":
      filteredObjekts = filteredObjekts.toSorted(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case "oldest":
      filteredObjekts = filteredObjekts.toSorted(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      break;
    case "noDescending":
      filteredObjekts = filteredObjekts.toSorted((a, b) =>
        b.collectionNo.localeCompare(a.collectionNo)
      );
      break;
    case "noAscending":
      filteredObjekts = filteredObjekts.toSorted((a, b) =>
        a.collectionNo.localeCompare(b.collectionNo)
      );
      break;
  }

  return filteredObjekts;
}

export function filterObjektsOwned(
  filters: CosmoFilters,
  objekts: OwnedObjekt[]
) {
  let filteredObjekts = [...objekts];

  if (filters.member) {
    filteredObjekts = filteredObjekts.filter(
      (a) => a.member === filters.member
    );
  }
  if (filters.artist) {
    filteredObjekts = filteredObjekts.filter((a) =>
      a.artists.includes(filters.artist ?? "tripleS")
    );
  }
  if (filters.class) {
    filteredObjekts = filteredObjekts.filter((a) =>
      filters.class?.includes(a.class as ValidClass)
    );
  }
  if (filters.season) {
    filteredObjekts = filteredObjekts.filter((a) =>
      filters.season?.includes(a.season as ValidSeason)
    );
  }
  if (filters.on_offline) {
    filteredObjekts = filteredObjekts.filter(
      (a) =>
        (filters.on_offline?.includes("online")
          ? a.collectionNo.includes("Z")
          : false) ||
        (filters.on_offline?.includes("offline")
          ? a.collectionNo.includes("A")
          : false)
    );
  }
  if (filters.transferable) {
    filteredObjekts = filteredObjekts.filter((a) => a.transferable === true);
  }
  if (filters.gridable) {
    filteredObjekts = filteredObjekts.filter(
      (a) => a.usedForGrid === false && a.class === "First"
    );
  }

  const collectionNo = filters.collection ?? "";
  if (collectionNo) {
    filteredObjekts = filteredObjekts.filter((objekt) =>
      getCollectionShortId(objekt)
        ?.toLowerCase()
        ?.includes(collectionNo.toLowerCase())
    );
  }

  const sort = filters.sort ?? "newest";
  switch (sort) {
    case "newest":
      filteredObjekts = filteredObjekts.toSorted(
        (a, b) =>
          new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
      );
      break;
    case "oldest":
      filteredObjekts = filteredObjekts.toSorted(
        (a, b) =>
          new Date(a.receivedAt).getTime() - new Date(b.receivedAt).getTime()
      );
      break;
    case "noDescending":
      filteredObjekts = filteredObjekts.toSorted((a, b) =>
        b.collectionNo.localeCompare(a.collectionNo)
      );
      break;
    case "noAscending":
      filteredObjekts = filteredObjekts.toSorted((a, b) =>
        a.collectionNo.localeCompare(b.collectionNo)
      );
      break;
    case "serialDesc":
      filteredObjekts = filteredObjekts.toSorted(
        (a, b) => b.objektNo - a.objektNo
      );
      break;
    case "serialAsc":
      filteredObjekts = filteredObjekts.toSorted(
        (a, b) => a.objektNo - b.objektNo
      );
      break;
  }

  return filteredObjekts;
}
