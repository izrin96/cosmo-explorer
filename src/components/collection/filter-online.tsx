"use client";

import { type Selection } from "@react-types/shared"
import { PropsWithFilters } from "@/hooks/use-cosmo-filters";
import {
  ValidOnlineType,
  validOnlineTypes,
} from "@/lib/universal/cosmo/common";
import { memo, useCallback, useMemo } from "react";
import { Menu } from "../ui";
import { Button } from "../ui/button";

type Props = PropsWithFilters<"on_offline">;

const map: Record<ValidOnlineType, string> = {
  online: "Digital",
  offline: "Physical",
};

export default memo(function OnlineFilter({ filters, setFilters }: Props) {
  const selected = useMemo(() => new Set(filters), [filters]);

  const update = useCallback((key: Selection) => {
    const newFilters = [...key] as ValidOnlineType[];
    setFilters({
      on_offline: newFilters.length > 0 ? newFilters : null,
    });
  }, [setFilters]);

  return (
    <Menu>
      <Button appearance="outline" className={filters?.length ? "data-pressed:border-primary data-hovered:border-primary border-primary": ""}>Physical</Button>
      <Menu.Content
        placement="bottom"
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={update}
        items={Object.values(validOnlineTypes).map((value) => ({ value }))}
      >
        {(item) => (
          <Menu.Checkbox id={item.value} textValue={item.value}>
            {map[item.value]}
          </Menu.Checkbox>
        )}
      </Menu.Content>
    </Menu>
  );
});
