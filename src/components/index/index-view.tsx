"use client";

import { IndexedObjekt } from "@/lib/universal/objekts";
import { useEffect, useMemo, useState, useTransition } from "react";
import FilterView from "../collection/filter-view";
import { useCosmoFilters } from "@/hooks/use-cosmo-filters";
import { GRID_COLUMNS, GRID_COLUMNS_MOBILE } from "@/lib/utils";
import ObjektView, { ObjektModal } from "../objekt/objekt-view";
import { filterObjektsIndexed } from "@/lib/filter-utils";
import { CosmoArtistWithMembersBFF } from "@/lib/universal/cosmo/artists";
import { WindowVirtualizer } from "virtua";
import { useMediaQuery } from "@/hooks/use-media-query";
import { parseAsString, useQueryState } from "nuqs";
import { ObjektModalProvider } from "@/hooks/use-objekt-modal";

type Props = {
  artists: CosmoArtistWithMembersBFF[];
  objekts: IndexedObjekt[];
};

export default function IndexView({ objekts, artists }: Props) {
  const [filters] = useCosmoFilters();
  const [activeObjekt, setActiveObjekt] = useQueryState("id", parseAsString);
  const [open, setOpen] = useState(!!activeObjekt);

  const isDesktop = useMediaQuery();
  const columns = isDesktop
    ? filters.column ?? GRID_COLUMNS
    : GRID_COLUMNS_MOBILE;

  const [objektsFiltered, setObjektsFiltered] = useState<IndexedObjekt[]>([]);

  const [_, startTransition] = useTransition();

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
                  <ObjektView
                    objekts={[objekt]}
                    priority={j < columns * 3}
                    setActive={setActiveObjekt}
                  />
                )}
              </div>
            );
          })}
        </div>
      );
    });
    return rows;
  }, [objektsFiltered, columns, setActiveObjekt]);

  useEffect(() => {
    startTransition(() => {
      setObjektsFiltered(filterObjektsIndexed(filters, objekts));
    });
  }, [filters, objekts]);

  return (
    <div className="flex flex-col gap-2">
      <FilterView artists={artists} />
      <span className="font-semibold">{objektsFiltered.length} total</span>

      <ObjektModalProvider initialTab="metadata">
        <WindowVirtualizer>{virtualList}</WindowVirtualizer>

        {open && (
          <ObjektModal
            open={true}
            objekts={objekts.filter((objekt) => objekt.slug === activeObjekt)}
            onClose={() => {
              setOpen(false);
              setActiveObjekt(null);
            }}
          />
        )}
      </ObjektModalProvider>
    </div>
  );
}
