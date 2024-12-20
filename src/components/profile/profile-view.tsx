"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { CosmoPublicUser } from "@/lib/universal/cosmo/auth";
import FilterView from "../collection/filter-view";
import { useCosmoFilters } from "@/hooks/use-cosmo-filters";
import { GRID_COLUMNS, GRID_COLUMNS_MOBILE } from "@/lib/utils";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import ObjektView from "../objekt/objekt-view";
import { filterObjektsOwned } from "@/lib/filter-utils";
import { groupBy, prop } from "remeda";
import { CosmoArtistWithMembers } from "@/lib/universal/cosmo/artists";
import { Loader } from "../ui";
import { WindowVirtualizer } from "virtua";
import { useMediaQuery } from "@/hooks/use-media-query";
import { fetchOwnedObjektsParallel } from "@/lib/cosmo-request";
import { OwnedObjekt, OwnedObjektsResult } from "@/lib/universal/cosmo/objekts";

type Props = {
  artists: CosmoArtistWithMembers[];
  profile: CosmoPublicUser;
  initialData: OwnedObjektsResult;
};

export default function ProfileView({ profile, artists, initialData }: Props) {
  const [filters] = useCosmoFilters();

  const isDesktop = useMediaQuery();
  const columns = isDesktop
    ? filters.column ?? GRID_COLUMNS
    : GRID_COLUMNS_MOBILE;

  const [objektsFiltered, setObjektsFiltered] = useState<OwnedObjekt[][]>([]);

  const [_, startTransition] = useTransition();

  const queryFunction = useCallback(
    async ({ pageParam = 0 }: { pageParam?: number }) => {
      const pageCount = Math.ceil(initialData.total / 30);
      const currentPage = pageParam / 30;
      const requestCount = Math.min(pageCount - currentPage, 5);

      return fetchOwnedObjektsParallel(
        {
          address: profile.address,
          startAfter: pageParam,
        },
        requestCount
      );
    },
    [profile.address, initialData.total]
  );

  const { data, fetchNextPage, hasNextPage, isFetching } =
    useSuspenseInfiniteQuery({
      queryKey: ["owned-collections", profile.address],
      queryFn: queryFunction,
      initialPageParam: 0,
      initialData: () => ({
        pages: [{ ...initialData }],
        pageParams: [0],
      }),
      getNextPageParam: (lastPage) => lastPage.nextStartAfter,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });

  const objektsOwned = useMemo(() => {
    return data?.pages?.flatMap((page) => page.objekts) ?? [];
  }, [data]);

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
                    priority={j < columns * 3}
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
  }, [objektsFiltered, filters.grouped, columns]);

  useEffect(() => {
    startTransition(() => {
      const objekts = filterObjektsOwned(filters, objektsOwned);
      if (filters.grouped) {
        setObjektsFiltered(
          Object.values(groupBy(objekts, prop("collectionId")))
        );
      } else {
        setObjektsFiltered(objekts.map((objekt) => [objekt]));
      }
    });
  }, [filters, objektsOwned]);

  useEffect(() => {
    if (hasNextPage && isFetching === false) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, isFetching]);

  return (
    <div className="flex flex-col gap-2">
      <FilterView isOwned artists={artists} />
      <div className="flex items-center gap-2">
        {hasNextPage && <Loader />}
        <span className="font-bold">{objektsFiltered.length} total</span>
      </div>

      <WindowVirtualizer key={columns}>{virtualList}</WindowVirtualizer>
    </div>
  );
}
