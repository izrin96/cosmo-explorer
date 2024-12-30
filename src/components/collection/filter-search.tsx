"use client";

import { PropsWithFilters } from "@/hooks/use-cosmo-filters";
import { SearchField } from "../ui";

type Props = PropsWithFilters<"search">;

export default function FilterSearch({ filters, setFilters }: Props) {
  function update(value: string) {
    setFilters({
        search: value === "" ? null : value,
    });
  }

  return (
    <div>
      <SearchField
        placeholder="Search (split by commas)"
        onChange={(value) => update(value)}
        className="min-w-40"
        value={filters ?? ""}
        aria-label="Search"
      />
    </div>
  );
}
