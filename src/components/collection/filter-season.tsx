"use client";

import { type Selection } from "@react-types/shared"
import { PropsWithFilters } from "@/hooks/use-cosmo-filters";
import { ValidSeason, validSeasons } from "@/lib/universal/cosmo/common";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Menu } from "../ui";

type Props = PropsWithFilters<"season">;

export default function FilterSeason({ filters, setFilters }: Props) {
  const [selected, setSelected] = useState<Selection>(new Set(filters))

  useEffect(() => {
    const newFilters = [...selected] as ValidSeason[]
    setFilters({
      season: newFilters.length > 0 ? newFilters : null,
    });
  }, [selected])

  return (
    <Menu>
      <Button appearance="outline">Season</Button>
      <Menu.Content
        placement="bottom"
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={setSelected}
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
