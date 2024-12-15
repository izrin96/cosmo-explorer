"use client";

import { Input } from "@/components/ui/input";
import { PropsWithFilters } from "@/hooks/use-cosmo-filters";

type Props = PropsWithFilters<"collection">;

export default function FilterCollectionNo({ filters, setFilters }: Props) {
  function update(value: string) {
    setFilters({
      collection: value === "" ? null : value,
    });
  }

  return (
    <Input
      className="w-52"
      type="text"
      placeholder="Search Collection No."
      value={filters ?? ""}
      onChange={(e) => update(e.target.value)}
    />
  );
}
