"use client";

import { PropsWithFilters } from "@/hooks/use-cosmo-filters";
import { memo } from "react";
import { Toggle } from "../ui";

type Props = PropsWithFilters<"gridable">;

export default memo(function GridableFilter({ filters, setFilters }: Props) {
  return (
    <Toggle
      appearance="outline"
      isSelected={filters ?? false}
      onChange={(v) =>
        setFilters({
          gridable: v ? true : null,
        })
      }
    >
      Gridable
    </Toggle>
  );
});
