"use client";

import { type Selection } from "@react-types/shared"
import { PropsWithFilters } from "@/hooks/use-cosmo-filters";
import {
  ValidOnlineType,
  validOnlineTypes,
} from "@/lib/universal/cosmo/common";
import { memo, useEffect, useState } from "react";
import { Menu } from "../ui";
import { Button } from "../ui/button";

type Props = PropsWithFilters<"on_offline">;

const map: Record<ValidOnlineType, string> = {
  online: "Digital",
  offline: "Physical",
};

export default memo(function OnlineFilter({ filters, setFilters }: Props) {
  const [selected, setSelected] = useState<Selection>(new Set(filters))

  useEffect(() => {
    const newFilters = [...selected] as ValidOnlineType[]
    setFilters({
      on_offline: newFilters.length > 0 ? newFilters : null,
    });
  }, [selected])

  return (
    <Menu>
      <Button appearance="outline">Physical</Button>
      <Menu.Content
        placement="bottom"
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={setSelected}
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
