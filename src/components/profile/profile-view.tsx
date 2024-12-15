"use client";

import { COSMO_ENDPOINT } from "@/lib/universal/cosmo/common";
import { OwnedObjektsResult } from "@/lib/universal/cosmo/objekts";
import { getCollectionShortId, parsePage } from "@/lib/universal/objekts";
import { ofetch } from "ofetch";
import React, { CSSProperties, useCallback, useEffect, useMemo } from "react";
import { CosmoPublicUser } from "@/lib/universal/cosmo/auth";
import FilterView from "../collection/filter-view";
import { useCosmoFilters } from "@/hooks/use-cosmo-filters";
import { GRID_COLUMNS } from "@/lib/utils";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import ObjektView from "../objekt/objekt-view";
import { filterObjektsOwned } from "@/lib/filter-utils";
import { groupBy, prop } from "remeda";
import { CosmoArtistWithMembers } from "@/lib/universal/cosmo/artists";
import { toast } from "sonner";

type Props = {
  artists: CosmoArtistWithMembers[];
  profile: CosmoPublicUser;
};

export default function ProfileView({ profile, artists }: Props) {
  const [filters] = useCosmoFilters();

  const queryFunction = useCallback(
    async ({ pageParam = 0 }: { pageParam?: number }) => {
      const endpoint = `${COSMO_ENDPOINT}/objekt/v1/owned-by/${profile.address}`;
      return await ofetch(endpoint, {
        query: {
          start_after: pageParam.toString(),
          sort: "newest",
        },
      })
        .then((res) => parsePage<OwnedObjektsResult>(res))
        .then((res) => ({
          ...res,
          objekts: res.objekts.map((objekt) => ({
            ...objekt,
            collectionShortId: getCollectionShortId(objekt),
          })),
        }));
    },
    [profile.address]
  );

  const { data, fetchNextPage, hasNextPage, isFetching } =
    useSuspenseInfiniteQuery({
      queryKey: ["owned-objekts"],
      queryFn: queryFunction,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextStartAfter,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });

  const objektsOwned = useMemo(() => {
    return data?.pages?.flatMap((page) => page.objekts) ?? [];
  }, [data]);

  const objektsFiltered = useMemo(() => {
    const objekts = filterObjektsOwned(filters, objektsOwned);
    if (filters.grouped) {
      return Object.values(groupBy(objekts, prop("collectionId")));
    }
    return objekts.map((objekt) => [objekt]);
  }, [filters, objektsOwned]);

  useEffect(() => {
    setTimeout(() => toast("Loading objekts.."), 100)
  }, [])

  useEffect(() => {
    if (hasNextPage && isFetching === false) {
      fetchNextPage();
    }
    if (!hasNextPage) toast("Objekts loaded");
  }, [hasNextPage, fetchNextPage, isFetching]);

  const css = {
    "--grid-columns": GRID_COLUMNS,
  } as CSSProperties;

  return (
    <div className="flex flex-col gap-2">
      <FilterView isOwned artists={artists} />
      <span className="font-bold">{objektsFiltered.length} total</span>
      <div
        style={css}
        className="relative grid grid-cols-3 gap-4 py-2 w-full md:grid-cols-[repeat(var(--grid-columns),_minmax(0,_1fr))]"
      >
        {objektsFiltered.map((objekts) => (
          <ObjektView
            objekts={objekts}
            key={objekts[0].tokenId}
            showSerial={!(filters.grouped ?? false)}
            isOwned
          />
        ))}
      </div>
    </div>
  );
}
