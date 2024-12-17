"use client";

import { IndexedObjekt } from "@/lib/universal/objekts";
import { useMemo } from "react";
import FilterView from "../collection/filter-view";
import { useCosmoFilters } from "@/hooks/use-cosmo-filters";
import { GRID_COLUMNS, GRID_COLUMNS_MOBILE } from "@/lib/utils";
import ObjektView from "../objekt/objekt-view";
import { filterObjektsIndexed } from "@/lib/filter-utils";
import { CosmoArtistWithMembers } from "@/lib/universal/cosmo/artists";
import { WindowVirtualizer } from "virtua";
import { useMediaQuery } from "@/hooks/use-media-query";

type Props = {
  artists: CosmoArtistWithMembers[];
  objekts: IndexedObjekt[];
};

export default function IndexView({ objekts, artists }: Props) {
  const [filters] = useCosmoFilters();

  const isDesktop = useMediaQuery();
  const columns = isDesktop
    ? filters.column ?? GRID_COLUMNS
    : GRID_COLUMNS_MOBILE;

  const objektsFiltered = useMemo(() => {
    return filterObjektsIndexed(filters, objekts);
  }, [filters, objekts]);

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
                {objekt && (
                  <ObjektView objekts={[objekt]} priority={j < columns * 3} />
                )}
              </div>
            );
          })}
        </div>
      );
    });
    return rows;
  }, [objektsFiltered, columns]);

  return (
    <div className="flex flex-col gap-2">
      <FilterView artists={artists} />
      <span className="font-bold">{objektsFiltered.length} total</span>

      <WindowVirtualizer key={columns}>{virtualList}</WindowVirtualizer>
    </div>
  );
}
