"use client";

import { PropsWithFilters } from "@/hooks/use-cosmo-filters";
import { ValidSort, validSorts } from "@/lib/universal/cosmo/common";
import { Select } from "../ui";

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
  function update(value: ValidSort) {
    setFilters((current) => ({
      sort: value === "newest" ? null : value,
      grouped: value.startsWith("duplicate") ? true : current.grouped,
    }));
  }

  const availableSorts = validSorts.filter((s) =>
    isOwned ? true : !s.startsWith("serial") && !s.startsWith("duplicate")
  );

  return (
    <Select
      className="w-48"
      selectedKey={filters ?? "newest"}
      onSelectionChange={(val) => update(val as ValidSort)}
      aria-label="Sort"
    >
      <Select.Trigger />
      <Select.List items={availableSorts.map((value) => ({ value }))}>
        {(item) => (
          <Select.Option id={item.value} textValue={item.value}>
            {map[item.value]}
          </Select.Option>
        )}
      </Select.List>
    </Select>
  );
}
