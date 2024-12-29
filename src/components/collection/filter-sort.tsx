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
  noAscending: "Lowest Collection No.",
  noDescending: "Highest Collection No.",
  serialAsc: "Lowest Serial",
  serialDesc: "Highest Serial",
  duplicateAsc: "Lowest Duplicate",
  duplicateDesc: "Highest Duplicate",
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
      sort: newValue,
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
        {(item) => <Menu.Radio id={item.value}>{map[item.value]}</Menu.Radio>}
      </Menu.Content>
    </Menu>
  );
}
