"use client";

import { getCollectionShortId, IndexedObjekt } from "@/lib/universal/objekts";
import React, { CSSProperties, useMemo } from "react";
import FilterView from "../collection/filter-view";
import { useCosmoFilters } from "@/hooks/use-cosmo-filters";
import { GRID_COLUMNS } from "@/lib/utils";
import ObjektView from "../objekt/objekt-view";
import { filterObjektsIndexed } from "@/lib/filter-utils";
import { CosmoArtistWithMembers } from "@/lib/universal/cosmo/artists";

type Props = {
  artists: CosmoArtistWithMembers[];
  objekts: IndexedObjekt[];
};

export default function IndexView({ objekts, artists }: Props) {
  const [filters] = useCosmoFilters();

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

  const css = {
    "--grid-columns": GRID_COLUMNS,
  } as CSSProperties;

  return (
    <div className="flex flex-col gap-2">
      <FilterView artists={artists} />
      <span className="font-bold">{objektsFiltered.length} total</span>
      <div
        style={css}
        className="relative grid grid-cols-3 gap-4 py-2 w-full md:grid-cols-[repeat(var(--grid-columns),_minmax(0,_1fr))]"
      >
        {objektsFiltered.map((objekt) => {
          return <ObjektView objekts={[objekt]} key={objekt.id} />;
        })}
      </div>
    </div>
  );
}
