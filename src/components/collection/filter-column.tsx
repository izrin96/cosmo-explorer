"use client";

import { PropsWithFilters } from "@/hooks/use-cosmo-filters";
import { memo } from "react";
import { NumberField } from "../ui";
import { GRID_COLUMNS, GRID_COLUMNS_MOBILE } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

type Props = PropsWithFilters<"column">;

export default memo(function ColumnFilter({ filters, setFilters }: Props) {
  const isDesktop = useMediaQuery();
  const defaultGridColumn = isDesktop ? GRID_COLUMNS : GRID_COLUMNS_MOBILE;

  function update(value: number) {
    if (isNaN(value)) return;
    setFilters({
      column: value === defaultGridColumn ? null : value,
    });
  }

  return (
    <NumberField
      className="w-32"
      aria-label="Column"
      placeholder="Grid Column"
      onChange={update}
      value={filters ?? defaultGridColumn}
      minValue={3}
    />
  );
});
