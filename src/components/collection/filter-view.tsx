"use client";

import React from "react";
import { useCosmoFilters } from "@/hooks/use-cosmo-filters";
import FilterSeason from "./filter-season";
import FilterSort from "./filter-sort";
import FilterGridable from "./filter-gridable";
import FilterTransferable from "./filter-transferable";
import FilterOnline from "./filter-online";
import FilterClass from "./filter-class";
import FilterCollectionNo from "./filter-collection-no";
import { Toggle } from "../ui/toggle";

type Props = {
  isOwned?: boolean;
};

export default function FilterView({ isOwned }: Props) {
  // todo: member filter
  // todo: artist filter
  const [filters, setFilters] = useCosmoFilters();

  return (
    <div className="flex gap-2 items-center flex-wrap justify-center">
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
          variant="outline"
          pressed={filters.grouped ?? false}
          onPressedChange={(v) =>
            setFilters({
              grouped: v ? true : null,
            })
          }
        >
          Group duplicate
        </Toggle>
      )}
    </div>
  );
}
