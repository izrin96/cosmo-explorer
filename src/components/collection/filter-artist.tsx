"use client";

import type { Selection } from "react-aria-components";
import { PropsWithFilters } from "@/hooks/use-cosmo-filters";
import { Button, Menu } from "../ui";
import { CosmoArtistWithMembers } from "@/lib/universal/cosmo/artists";
import { useCallback, useMemo } from "react";
import { ValidArtist } from "@/lib/universal/cosmo/common";

type Props = PropsWithFilters<"artist"> & {
  artists: CosmoArtistWithMembers[];
};

export default function ArtistFilter({ filters, setFilters, artists }: Props) {
  const selected = useMemo(() => new Set(filters ? [filters] : []), [filters]);

  const update = useCallback((key: Selection) => {
    const newFilters = [...key] as ValidArtist[];
    setFilters({
      artist: newFilters.length > 0 ? newFilters[0] : null,
      member: null,
    });
  }, [setFilters]);

  return (
    <Menu>
      <Button appearance="outline" className={filters ? "border-primary": ""}>Artist</Button>
      <Menu.Content
        selectionMode="single"
        selectedKeys={selected}
        onSelectionChange={update}
        items={artists}
        className="max-h-72 min-w-52"
      >
        {(item) => <Menu.Radio id={item.name}>{item.title}</Menu.Radio>}
      </Menu.Content>
    </Menu>
  );
}
