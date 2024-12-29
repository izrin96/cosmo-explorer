"use client";

import { type Selection } from "@react-types/shared"
import { ValidClass, validClasses } from "@/lib/universal/cosmo/common";
import { memo, useCallback, useMemo } from "react";
import { PropsWithFilters } from "@/hooks/use-cosmo-filters";
import { Button, Menu } from "../ui";

type Props = PropsWithFilters<"class">;

export default memo(function ClassFilter({ filters, setFilters }: Props) {
  const selected = useMemo(() => new Set(filters), [filters]);

  const update = useCallback((key: Selection) => {
    const newFilters = [...key] as ValidClass[];
    setFilters({
      class: newFilters.length > 0 ? newFilters : null,
    });
  }, [setFilters]);

  return (
    <Menu>
      <Button appearance="outline" className={filters?.length ? "data-pressed:border-primary data-hovered:border-primary border-primary": ""}>Class</Button>
      <Menu.Content
        placement="bottom"
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={update}
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
