"use client";

import { PropsWithFilters } from "@/hooks/use-cosmo-filters";
import { TextField } from "../ui";

type Props = PropsWithFilters<"search">;

export default function FilterSearch({ filters, setFilters }: Props) {
  function update(value: string) {
    setFilters({
      search: value === "" ? null : value,
    });
  }

  return (
    <div>
      <TextField
        placeholder={`Search (eg: naky 305,jw e304)`}
        onChange={(value) => update(value)}
        className="min-w-56"
        value={filters ?? ""}
        aria-label="Search"
      />
    </div>
  );
}
