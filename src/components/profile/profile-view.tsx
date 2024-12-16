"use client";

import { COSMO_ENDPOINT } from "@/lib/universal/cosmo/common";
import { OwnedObjektsResult } from "@/lib/universal/cosmo/objekts";
import { getCollectionShortId, parsePage } from "@/lib/universal/objekts";
import { ofetch } from "ofetch";
import { CSSProperties, useCallback, useEffect, useMemo } from "react";
import { CosmoPublicUser } from "@/lib/universal/cosmo/auth";
import FilterView from "../collection/filter-view";
import { useCosmoFilters } from "@/hooks/use-cosmo-filters";
import { GRID_COLUMNS } from "@/lib/utils";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import ObjektView from "../objekt/objekt-view";
import { filterObjektsOwned } from "@/lib/filter-utils";
import { groupBy, prop } from "remeda";
import { CosmoArtistWithMembers } from "@/lib/universal/cosmo/artists";
import { Loader } from "../ui";
import { WindowVirtualizer } from "virtua";
// import { Virtuoso } from "react-virtuoso";

type Props = {
  artists: CosmoArtistWithMembers[];
  profile: CosmoPublicUser;
};

export default function ProfileView({ profile, artists }: Props) {
  const [filters] = useCosmoFilters();

  const columns = filters.column ?? GRID_COLUMNS;

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
      queryKey: ["owned-objekts", profile.address],
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
    if (hasNextPage && isFetching === false) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, isFetching]);

  const virtualList = useMemo(() => {
    var rows = Array.from({
      length: Math.ceil(objektsFiltered.length / columns),
    }).map((_, i) => {
      return (
        <div key={i} className="flex gap-4 pb-4">
          {Array.from({ length: columns }).map((_, j) => {
            const index = i * columns + j;
            const objekts = objektsFiltered[index];
            return (
              <div className="flex-1" key={j}>
                {objekts && (
                  <ObjektView
                    objekts={objekts}
                    showSerial={!(filters.grouped ?? false)}
                    isOwned
                  />
                )}
              </div>
            );
          })}
        </div>
      );
    });
    return rows;
  }, [objektsFiltered, columns]);

  // const css = {
  //   "--grid-columns": columns,
  // } as CSSProperties;

  return (
    <div className="flex flex-col gap-2">
      <FilterView isOwned artists={artists} />
      <div className="flex items-center gap-2">
        {hasNextPage && <Loader />}
        <span className="font-bold">{objektsFiltered.length} total</span>
      </div>

      {/* <Virtuoso
        useWindowScroll
        overscan={900}
        totalCount={virtualList.length}
        itemContent={(i) => {
          return virtualList[i]
        }}
      /> */}

      <WindowVirtualizer>{virtualList}</WindowVirtualizer>
    </div>
  );
}
