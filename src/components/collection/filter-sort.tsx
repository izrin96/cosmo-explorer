"use client";

import { PropsWithFilters } from "@/hooks/use-cosmo-filters";
import { ValidSort, validSorts } from "@/lib/universal/cosmo/common";
import { Select } from "../ui";

interface Props extends PropsWithFilters<"sort"> {
  showSerial?: boolean;
}

const map: Record<ValidSort, string> = {
  newest: "Newest",
  oldest: "Oldest",
  noAscending: "Lowest Collection No.",
  noDescending: "Highest Collection No.",
  serialAsc: "Lowest Serial",
  serialDesc: "Highest Serial",
};

export default function SortFilter({
  filters,
  setFilters,
  showSerial = false,
}: Props) {
  function update(value: ValidSort) {
    setFilters({
      sort: value === "newest" ? null : value,
    });
  }

  const availableSorts = validSorts.filter((s) =>
    showSerial ? true : !s.startsWith("serial")
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
