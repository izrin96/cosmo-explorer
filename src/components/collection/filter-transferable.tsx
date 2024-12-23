"use client";

import { PropsWithFilters } from "@/hooks/use-cosmo-filters";
import { memo } from "react";
import { Toggle } from "../ui";

type Props = PropsWithFilters<"transferable">;

export default memo(function TransferableFilter({
  filters,
  setFilters,
}: Props) {
  return (
    <Toggle
      className="data-selected:border-primary"
      size="medium"
      appearance="outline"
      isSelected={filters ?? false}
      onChange={(v) =>
        setFilters({
          transferable: v ? true : null,
        })
      }
    >
      Transferable
    </Toggle>
  );
});
