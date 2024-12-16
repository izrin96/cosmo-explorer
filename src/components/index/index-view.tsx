"use client";

import { getCollectionShortId, IndexedObjekt } from "@/lib/universal/objekts";
import { CSSProperties, useMemo } from "react";
import FilterView from "../collection/filter-view";
import { useCosmoFilters } from "@/hooks/use-cosmo-filters";
import { GRID_COLUMNS } from "@/lib/utils";
import ObjektView from "../objekt/objekt-view";
import { filterObjektsIndexed } from "@/lib/filter-utils";
import { CosmoArtistWithMembers } from "@/lib/universal/cosmo/artists";
import { WindowVirtualizer } from "virtua";

type Props = {
  artists: CosmoArtistWithMembers[];
  objekts: IndexedObjekt[];
};

export default function IndexView({ objekts, artists }: Props) {
  const [filters] = useCosmoFilters();

  const columns = filters.column ?? GRID_COLUMNS;

  const objektsMap = useMemo(() => {
    return objekts.map((objekt) => {
      return {
        ...objekt,
        collectionShortId: getCollectionShortId(objekt),
      };
    });
  }, [objekts]);

  const objektsFiltered = useMemo(() => {
    return filterObjektsIndexed(filters, objektsMap);
  }, [filters, objektsMap]);

  const virtualList = useMemo(() => {
    var rows = Array.from({
      length: Math.ceil(objektsFiltered.length / columns),
    }).map((_, i) => {
      return (
        <div key={i} className="flex gap-3 md:gap-4 pb-4">
          {Array.from({ length: columns }).map((_, j) => {
            const index = i * columns + j;
            const objekt = objektsFiltered[index];
            return (
              <div className="flex-1" key={j}>
                {objekt && <ObjektView objekts={[objekt]} />}
              </div>
            );
          })}
        </div>
      );
    });
    return rows;
  }, [objektsFiltered, columns]);

  // const css = {
  //   "--grid-columns": filters.column ?? GRID_COLUMNS,
  // } as CSSProperties;

  return (
    <div className="flex flex-col gap-2">
      <FilterView artists={artists} />
      <span className="font-bold">{objektsFiltered.length} total</span>

      <WindowVirtualizer>{virtualList}</WindowVirtualizer>
    </div>
  );
}
