"use client";

import { PropsWithFilters } from "@/hooks/use-cosmo-filters";
import { memo } from "react";
import { NumberField } from "../ui";
import { GRID_COLUMNS } from "@/lib/utils";

type Props = PropsWithFilters<"column">;

export default memo(function ColumnFilter({ filters, setFilters }: Props) {
  function update(value: number) {
    setFilters({
      column: value === GRID_COLUMNS ? null : value,
    });
  }

  return (
    <NumberField
      className="w-20"
      aria-label="Column"
      placeholder="Grid Column"
      onChange={update}
      value={filters ?? GRID_COLUMNS}
      minValue={3}
    />
  );
});
