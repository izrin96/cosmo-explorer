"use client";

import { PropsWithFilters } from "@/hooks/use-cosmo-filters";
import { TagField, TagItemProps } from "../ui";
import { useListData } from "react-stately";
import { useEffect } from "react";

type Props = PropsWithFilters<"searches">;

export default function FilterSearches({ filters, setFilters }: Props) {
  const selectedItems = useListData<TagItemProps>({
    initialItems: filters?.map((val, i) => ({ id: i, name: val })) ?? [],
  });

  useEffect(() => {
    setFilters({
      searches:
        selectedItems.items.length > 0
          ? selectedItems.items.map((item) => item.name)
          : null,
    });
  }, [selectedItems.items]);

  return (
    <TagField
      placeholder="Search (press enter)"
      className="max-w-xs"
      aria-label="Search"
      list={selectedItems}
    />
  );
}
