"use client";

import { useCosmoFilters } from "@/hooks/use-cosmo-filters";
import FilterSeason from "./filter-season";
import FilterSort from "./filter-sort";
import FilterGridable from "./filter-gridable";
import FilterTransferable from "./filter-transferable";
import FilterOnline from "./filter-online";
import FilterClass from "./filter-class";
import FilterSearch from "./filter-search";
import { Toggle } from "../ui";
import MemberFilter from "./filter-member";
import { CosmoArtistWithMembersBFF } from "@/lib/universal/cosmo/artists";
import ArtistFilter from "./filter-artist";
import ColumnFilter from "./filter-column";
import { useMediaQuery } from "@/hooks/use-media-query";

type Props = {
  artists: CosmoArtistWithMembersBFF[];
  isOwned?: boolean;
};

export default function FilterView({ isOwned, artists }: Props) {
  const isDesktop = useMediaQuery();
  const [filters, setFilters] = useCosmoFilters();

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
        isOwned={isOwned}
      />
      <FilterSearch
        filters={filters.search}
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
