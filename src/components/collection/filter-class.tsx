"use client";

import { type Selection } from "@react-types/shared"
import { ValidClass, validClasses } from "@/lib/universal/cosmo/common";
import { memo, useEffect, useState } from "react";
import { PropsWithFilters } from "@/hooks/use-cosmo-filters";
import { Button } from "../ui/button";
import { Menu } from "../ui";

type Props = PropsWithFilters<"class">;

export default memo(function ClassFilter({ filters, setFilters }: Props) {
  const [selected, setSelected] = useState<Selection>(new Set(filters))

  useEffect(() => {
    const newFilters = [...selected] as ValidClass[]
    setFilters({
      class: newFilters.length > 0 ? newFilters : null,
    });
  }, [selected])

  return (
    <Menu>
      <Button appearance="outline">Class</Button>
      <Menu.Content
        placement="bottom"
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={setSelected}
        items={Object.values(validClasses).map((value) => ({ value }))}
      >
        {(item) => (
          <Menu.Checkbox id={item.value} textValue={item.value}>
            {item.value}
          </Menu.Checkbox>
        )}
      </Menu.Content>
    </Menu>
  );
});
