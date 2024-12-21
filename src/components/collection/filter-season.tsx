"use client";

import { type Selection } from "@react-types/shared"
import { PropsWithFilters } from "@/hooks/use-cosmo-filters";
import { ValidSeason, validSeasons } from "@/lib/universal/cosmo/common";
import { useMemo, useCallback } from "react";
import { Button } from "../ui/button";
import { Menu } from "../ui";

type Props = PropsWithFilters<"season">;

export default function FilterSeason({ filters, setFilters }: Props) {
  const selected = useMemo(() => new Set(filters), [filters]);

  const update = useCallback((key: Selection) => {
    const newFilters = [...key] as ValidSeason[];
    setFilters({
      season: newFilters.length > 0 ? newFilters : null,
    });
  }, [setFilters]);

  return (
    <Menu>
      <Button appearance="outline" className={filters?.length ? "data-pressed:border-primary data-hovered:border-primary border-primary": ""}>Season</Button>
      <Menu.Content
        placement="bottom"
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={update}
        items={Object.values(validSeasons).map((value) => ({ value }))}
      >
        {(item) => (
          <Menu.Checkbox id={item.value} textValue={item.value}>
            {item.value}
          </Menu.Checkbox>
        )}
      </Menu.Content>
    </Menu>
  );
}
