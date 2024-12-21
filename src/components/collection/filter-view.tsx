"use client";

import { useCosmoFilters } from "@/hooks/use-cosmo-filters";
import FilterSeason from "./filter-season";
import FilterSort from "./filter-sort";
import FilterGridable from "./filter-gridable";
import FilterTransferable from "./filter-transferable";
import FilterOnline from "./filter-online";
import FilterClass from "./filter-class";
import FilterCollectionNo from "./filter-collection-no";
import { Toggle } from "../ui/toggle";
import MemberFilter from "./filter-member";
import { CosmoArtistWithMembers } from "@/lib/universal/cosmo/artists";
import ArtistFilter from "./filter-artist";
import ColumnFilter from "./filter-column";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useEffect, useState } from "react";

type Props = {
  artists: CosmoArtistWithMembers[];
  isOwned?: boolean;
};

export default function FilterView({ isOwned, artists }: Props) {
  const [mounted, setMounted] = useState(false);
  const isDesktop = useMediaQuery();
  const [filters, setFilters] = useCosmoFilters();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null

  return (
    <div className="flex gap-2 items-center flex-wrap justify-center">
      <ArtistFilter
        filters={filters.artist}
        setFilters={setFilters}
        artists={artists}
      />
      <MemberFilter
        filters={filters.member}
        setFilters={setFilters}
        artists={artists}
      />
      {isOwned && (
        <FilterGridable filters={filters.gridable} setFilters={setFilters} />
      )}
      {isOwned && (
        <FilterTransferable
          filters={filters.transferable}
          setFilters={setFilters}
        />
      )}
      <FilterSeason filters={filters.season} setFilters={setFilters} />
      <FilterOnline filters={filters.on_offline} setFilters={setFilters} />
      <FilterClass filters={filters.class} setFilters={setFilters} />
      <FilterSort
        filters={filters.sort}
        setFilters={setFilters}
        showSerial={isOwned}
      />
      <FilterCollectionNo
        filters={filters.collection}
        setFilters={setFilters}
      />
      {isOwned && (
        <Toggle
          className="data-selected:border-primary"
          appearance="outline"
          size="medium"
          isSelected={filters.grouped ?? false}
          onChange={(v) =>
            setFilters({
              grouped: v ? true : null,
            })
          }
        >
          Combine duplicate
        </Toggle>
      )}
      {isDesktop && (
        <ColumnFilter filters={filters.column} setFilters={setFilters} />
      )}
    </div>
  );
}
