import { CosmoFilters } from "@/hooks/use-cosmo-filters";
import { ValidClass, ValidSeason } from "@/lib/universal/cosmo/common";
import {
  getSeasonCollectionNo,
  IndexedObjekt,
  ValidObjekt,
} from "./universal/objekts";
import { OwnedObjekt } from "./universal/cosmo/objekts";
import { groupBy, prop } from "remeda";

const searchFilter = (search: string) => (objekt: ValidObjekt) => {
  const searchLower = search.toLowerCase();
  return (
    `${objekt.member} ${objekt.collectionNo}`
      .toLowerCase()
      .includes(searchLower) ||
    `${objekt.member} ${getSeasonCollectionNo(objekt)}`
      .toLowerCase()
      .includes(searchLower)
  );
};

export function filterObjektsIndexed(
  filters: CosmoFilters,
  objekts: IndexedObjekt[]
) {
  if (filters.member) {
    objekts = objekts.filter((a) => a.member === filters.member);
  }
  if (filters.artist) {
    objekts = objekts.filter((a) => a.artist === filters.artist);
  }
  if (filters.class) {
    objekts = objekts.filter((a) =>
      filters.class?.includes(a.class as ValidClass)
    );
  }
  if (filters.season) {
    objekts = objekts.filter((a) =>
      filters.season?.includes(a.season as ValidSeason)
    );
  }
  if (filters.on_offline) {
    objekts = objekts.filter((a) => filters.on_offline?.includes(a.onOffline));
  }

  if (filters.search) {
    // objekts = objekts.filter(searchFilter(search));
    // support multiple query split by commas
    const searches = filters.search
      .split(",")
      .filter(Boolean)
      .map((a) => a.trim());
    objekts = objekts.filter((objekt) =>
      searches.some((s) => searchFilter(s)(objekt))
    );
  }

  const searches = filters.searches ?? [];
  if (searches.length > 0) {
    objekts = objekts.filter((objekt) =>
      searches.some((s) => searchFilter(s)(objekt))
    );
  }

  const sort = filters.sort ?? "newest";
  switch (sort) {
    case "newest":
      objekts = objekts.toSorted(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case "oldest":
      objekts = objekts.toSorted(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      break;
    case "noDescending":
      objekts = objekts.toSorted((a, b) =>
        b.collectionNo.localeCompare(a.collectionNo)
      );
      break;
    case "noAscending":
      objekts = objekts.toSorted((a, b) =>
        a.collectionNo.localeCompare(b.collectionNo)
      );
      break;
  }

  return objekts;
}

export function filterObjektsOwned(
  filters: CosmoFilters,
  objekts: OwnedObjekt[]
) {
  if (filters.member) {
    objekts = objekts.filter((a) => a.member === filters.member);
  }
  if (filters.artist) {
    objekts = objekts.filter((a) =>
      a.artists.includes(filters.artist ?? "tripleS")
    );
  }
  if (filters.class) {
    objekts = objekts.filter((a) =>
      filters.class?.includes(a.class as ValidClass)
    );
  }
  if (filters.season) {
    objekts = objekts.filter((a) =>
      filters.season?.includes(a.season as ValidSeason)
    );
  }
  if (filters.on_offline) {
    objekts = objekts.filter(
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
    objekts = objekts.filter((a) => a.transferable === true);
  }
  if (filters.gridable) {
    objekts = objekts.filter(
      (a) => a.usedForGrid === false && a.class === "First"
    );
  }

  if (filters.search) {
    // objekts = objekts.filter(searchFilter(search));
    // support multiple query split by commas
    const searches = filters.search
      .split(",")
      .filter(Boolean)
      .map((a) => a.trim());
    objekts = objekts.filter((objekt) =>
      searches.some((s) => searchFilter(s)(objekt))
    );
  }

  const searches = filters.searches ?? [];
  if (searches.length > 0) {
    objekts = objekts.filter((objekt) =>
      searches.some((s) => searchFilter(s)(objekt))
    );
  }

  const sort = filters.sort ?? "newest";
  switch (sort) {
    case "newest":
      objekts = objekts.toSorted(
        (a, b) =>
          new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
      );
      break;
    case "oldest":
      objekts = objekts.toSorted(
        (a, b) =>
          new Date(a.receivedAt).getTime() - new Date(b.receivedAt).getTime()
      );
      break;
    case "noDescending":
      objekts = objekts.toSorted((a, b) =>
        b.collectionNo.localeCompare(a.collectionNo)
      );
      break;
    case "noAscending":
      objekts = objekts.toSorted((a, b) =>
        a.collectionNo.localeCompare(b.collectionNo)
      );
      break;
    case "serialDesc":
      objekts = objekts.toSorted((a, b) => b.objektNo - a.objektNo);
      break;
    case "serialAsc":
      objekts = objekts.toSorted((a, b) => a.objektNo - b.objektNo);
      break;
  }

  return objekts;
}

export function filterGroupedObjektsOwned(
  filters: CosmoFilters,
  objekts: OwnedObjekt[][]
) {
  const sort = filters.sort ?? "newest";
  switch (sort) {
    case "duplicateDesc":
      objekts = objekts.toSorted((a, b) => b.length - a.length);
      break;
    case "duplicateAsc":
      objekts = objekts.toSorted((a, b) => a.length - b.length);
      break;
  }
  return objekts;
}

export function filterAndGroupObjektsOwned(
  filters: CosmoFilters,
  objekts: OwnedObjekt[]
) {
  objekts = filterObjektsOwned(filters, objekts);
  let groupedObjekts: OwnedObjekt[][];
  if (filters.grouped) {
    groupedObjekts = Object.values(groupBy(objekts, prop("collectionId")));
  } else {
    groupedObjekts = objekts.map((objekt) => [objekt]);
  }
  return filterGroupedObjektsOwned(filters, groupedObjekts);
}
