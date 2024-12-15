"use client";

import { PropsWithFilters } from "@/hooks/use-cosmo-filters";
import { TextField } from "../ui";

type Props = PropsWithFilters<"collection">;

export default function FilterCollectionNo({ filters, setFilters }: Props) {
  function update(value: string) {
    setFilters({
      collection: value === "" ? null : value,
    });
  }

  return (
    <div>
      <TextField
        placeholder="Search.."
        onChange={(value) => update(value)}
        className="w-40"
        value={filters ?? ""}
        aria-label="Search"
      />
    </div>
  );
}
