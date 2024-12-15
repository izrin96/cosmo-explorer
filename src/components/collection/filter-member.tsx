"use client";

import type { Selection } from "react-aria-components";
import { PropsWithFilters } from "@/hooks/use-cosmo-filters";
import { Button, Menu } from "../ui";
import { CosmoArtistWithMembers } from "@/lib/universal/cosmo/artists";
import { useCallback, useMemo } from "react";

type Props = PropsWithFilters<"member"> & {
  artists: CosmoArtistWithMembers[];
};

export default function MemberFilter({ filters, setFilters, artists }: Props) {
  const selected = useMemo(() => new Set(filters ? [filters] : []), [filters]);

  const update = useCallback((key: Selection) => {
    const newFilters = [...key] as string[];
    setFilters({
      member: newFilters.length > 0 ? newFilters[0] : null,
      artist: null,
    });
  }, []);

  return (
    <Menu>
      <Button appearance="outline">Member</Button>
      <Menu.Content
        selectionMode="single"
        selectedKeys={selected}
        onSelectionChange={update}
        items={artists}
        className="max-h-72 min-w-52"
      >
        {(artist) => (
          <Menu.Section
            title={artist.title}
            items={artist.members}
            id={artist.name}
          >
            {(member) => (
              <Menu.Radio id={member.name}>{member.name}</Menu.Radio>
            )}
          </Menu.Section>
        )}
      </Menu.Content>
    </Menu>
  );
}
