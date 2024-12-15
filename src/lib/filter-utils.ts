import { CosmoFilters } from "@/hooks/use-cosmo-filters";
import { ValidClass, ValidSeason } from "@/lib/universal/cosmo/common";
import { IndexedObjekt } from "./universal/objekts";
import { prop, sortBy, sort as rSort } from "remeda";
import { OwnedObjekt } from "./universal/cosmo/objekts";

export function filterObjektsIndexed(filters: CosmoFilters, objekts: (IndexedObjekt & { collectionShortId: string })[]) {
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

    const collectionNo = filters.collection ?? ''
    if (collectionNo) {
        filteredObjekts = filteredObjekts.filter(a => a.collectionShortId?.toLowerCase()?.includes(collectionNo.toLowerCase()))
    }

    const sort = filters.sort ?? "newest";
    switch (sort) {
        case "newest":
            filteredObjekts = sortBy(filteredObjekts, [prop("createdAt"), "desc"])
            break
        case "oldest":
            filteredObjekts = sortBy(filteredObjekts, [prop("createdAt"), "asc"])
            break
        case "noDescending":
            filteredObjekts = sortBy(filteredObjekts, [prop("collectionNo"), "desc"])
            break
        case "noAscending":
            filteredObjekts = sortBy(filteredObjekts, [prop("collectionNo"), "asc"])
            break
    }

    return filteredObjekts;
}

export function filterObjektsOwned(filters: CosmoFilters, objekts: (OwnedObjekt & { collectionShortId: string })[]) {
    let filteredObjekts = [...objekts];

    if (filters.member) {
        filteredObjekts = filteredObjekts.filter(
            (a) => a.member === filters.member
        );
    }
    if (filters.artist) {
        filteredObjekts = filteredObjekts.filter(
            (a) => a.artists.includes(filters.artist ?? 'tripleS')
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
            (filters.on_offline?.includes('online') ? a.collectionNo.includes('Z') : false) ||
            (filters.on_offline?.includes('offline') ? a.collectionNo.includes('A') : false)
        );
    }
    if (filters.transferable) {
        filteredObjekts = filteredObjekts.filter((a) =>
            a.transferable === true
        );
    }
    if (filters.gridable) {
        filteredObjekts = filteredObjekts.filter((a) =>
            a.usedForGrid === false && a.class === "First"
        );
    }

    const collectionNo = filters.collection ?? ''
    if (collectionNo) {
        filteredObjekts = filteredObjekts.filter(a => a.collectionShortId?.toLowerCase()?.includes(collectionNo.toLowerCase()))
    }

    const sort = filters.sort ?? "newest";
    switch (sort) {
        case "newest":
            filteredObjekts = sortBy(filteredObjekts, [prop("receivedAt"), "desc"])
            break
        case "oldest":
            filteredObjekts = sortBy(filteredObjekts, [prop("receivedAt"), "asc"])
            break
        case "noDescending":
            filteredObjekts = sortBy(filteredObjekts, [prop("collectionNo"), "desc"])
            break
        case "noAscending":
            filteredObjekts = sortBy(filteredObjekts, [prop("collectionNo"), "asc"])
            break
        case "serialDesc":
            filteredObjekts = rSort(filteredObjekts, (a, b) => b.objektNo - a.objektNo)
            break
        case "serialAsc":
            filteredObjekts = rSort(filteredObjekts, (a, b) => a.objektNo - b.objektNo)
            break
    }

    return filteredObjekts;
}
