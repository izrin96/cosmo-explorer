"use client";

import { PropsWithFilters } from "@/hooks/use-cosmo-filters";
import { MultipleSelect, SelectedKey } from "../ui";
import { useListData } from "react-stately";
import { useEffect } from "react";

type Props = PropsWithFilters<"searches">;

export default function FilterSearches({ filters, setFilters }: Props) {
  const selectedItems = useListData<SelectedKey>({
    initialItems: filters?.map((val, i) => ({ id: i, name: val })) ?? [],
  });

  const items: SelectedKey[] = [];

  useEffect(() => {
    setFilters({
      searches:
        selectedItems.items.length > 0
          ? selectedItems.items.map((item) => item.name)
          : null,
    });
  }, [selectedItems.items, setFilters]);

  return (
    <MultipleSelect
      shouldFocusWrap
      className="max-w-sm"
      aria-label="Search"
      selectedItems={selectedItems}
      items={items}
      tag={(item) => (
        <MultipleSelect.Tag textValue={item.name}>
          {item.name}
        </MultipleSelect.Tag>
      )}
    >
      {(item) => {
        return (
          <MultipleSelect.Option textValue={item.name}>
            {item.name}
          </MultipleSelect.Option>
        );
      }}
    </MultipleSelect>
  );
}
