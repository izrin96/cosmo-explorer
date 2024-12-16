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

type Props = {
  artists: CosmoArtistWithMembers[];
  isOwned?: boolean;
};

export default function FilterView({ isOwned, artists }: Props) {
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
        showSerial={isOwned}
      />
      <FilterCollectionNo
        filters={filters.collection}
        setFilters={setFilters}
      />
      {isOwned && (
        <Toggle
          className="selected:border-primary"
          appearance="outline"
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
      <ColumnFilter filters={filters.column} setFilters={setFilters} />
    </div>
  );
}
