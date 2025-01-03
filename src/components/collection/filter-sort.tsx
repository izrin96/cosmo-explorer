"use client";

import type { Selection } from "react-aria-components";
import { PropsWithFilters } from "@/hooks/use-cosmo-filters";
import { ValidSort, validSorts } from "@/lib/universal/cosmo/common";
import { Button, Menu } from "../ui";
import { useMemo } from "react";

interface Props extends PropsWithFilters<"sort"> {
  isOwned?: boolean;
}

const map: Record<ValidSort, string> = {
  newest: "Newest",
  oldest: "Oldest",
  newestSeason: "Newest Season",
  oldestSeason: "Oldest Season",
  noDescending: "Highest Collection No.",
  noAscending: "Lowest Collection No.",
  serialDesc: "Highest Serial",
  serialAsc: "Lowest Serial",
  duplicateDesc: "Highest Duplicate",
  duplicateAsc: "Lowest Duplicate",
};

const mapDesc: Record<ValidSort, string> = {
  newest: "Sort by date (desc)",
  oldest: "Sort by date (asc)",
  newestSeason: "Sort by Season (desc) and Collection No. (desc)",
  oldestSeason: "Sort by Season (asc) and Collection No. (asc)",
  noDescending: "Sort by Collection No. (desc)",
  noAscending: "Sort by Collection No. (asc)",
  serialDesc: "Sort by Serial (desc)",
  serialAsc: "Sort by Serial (asc)",
  duplicateDesc: "Sort by duplicate count (desc)",
  duplicateAsc: "Sort by duplicate count (asc)",
};

export default function SortFilter({
  filters,
  setFilters,
  isOwned = false,
}: Props) {
  const selected = useMemo(() => new Set(filters ? [filters] : []), [filters]);

  function update(key: Selection) {
    const newFilters = [...key] as string[];
    const newValue =
      newFilters.length > 0 ? (newFilters[0] as ValidSort) : "newest";

    setFilters((current) => ({
      sort: newValue === "newest" ? null : newValue,
      grouped: newValue.startsWith("duplicate") ? true : current.grouped,
    }));
  }

  const availableSorts = validSorts.filter((s) =>
    isOwned ? true : !s.startsWith("serial") && !s.startsWith("duplicate")
  );

  return (
    <Menu>
      <Button appearance="outline">{map[filters ?? "newest"]}</Button>
      <Menu.Content
        selectionMode="single"
        selectedKeys={selected}
        onSelectionChange={update}
        items={availableSorts.map((value) => ({ value }))}
        className="min-w-52"
      >
        {(item) => (
          <Menu.Radio id={item.value} textValue={map[item.value]}>
            <Menu.ItemDetails
              label={map[item.value]}
              description={mapDesc[item.value]}
            />
          </Menu.Radio>
        )}
      </Menu.Content>
    </Menu>
  );
}
