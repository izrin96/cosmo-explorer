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
import {
  QueryErrorResetBoundary,
  useInfiniteQuery,
} from "@tanstack/react-query";
import ObjektView from "../objekt/objekt-view";
import { filterAndGroupObjektsOwned } from "@/lib/filter-utils";
import { CosmoArtistWithMembersBFF } from "@/lib/universal/cosmo/artists";
import { Loader } from "../ui";
import { WindowVirtualizer } from "virtua";
import { useMediaQuery } from "@/hooks/use-media-query";
import { fetchOwnedObjektsParallel } from "@/lib/cosmo-request";
import { OwnedObjekt } from "@/lib/universal/cosmo/objekts";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallbackRender from "../error-fallback";
import { ObjektModalProvider } from "@/hooks/use-objekt-modal";

type Props = {
  artists: CosmoArtistWithMembersBFF[];
  profile: CosmoPublicUser;
};

export default function ProfileObjektRender({ ...props }: Props) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallbackRender}>
          <ProfileObjekt {...props} />
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

function ProfileObjekt({ profile, artists }: Props) {
  const [filters] = useCosmoFilters();

  const isDesktop = useMediaQuery();
  const columns = isDesktop
    ? filters.column ?? GRID_COLUMNS
    : GRID_COLUMNS_MOBILE;

  const [objektsFiltered, setObjektsFiltered] = useState<OwnedObjekt[][]>([]);

  const [_, startTransition] = useTransition();

  const queryFunction = useCallback(
    ({ pageParam = 0 }: { pageParam?: number }) => {
      return fetchOwnedObjektsParallel({
        address: profile.address,
        startAfter: pageParam,
      });
    },
    [profile.address]
  );

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["owned-collections", profile.address],
    queryFn: queryFunction,
    initialPageParam: 0,
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
  }, [objektsFiltered, columns]);

  useEffect(() => {
    startTransition(() => {
      setObjektsFiltered(filterAndGroupObjektsOwned(filters, objektsOwned));
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
        <span className="font-semibold">
          {objektsFiltered.flatMap((item) => item).length} total
          {filters.grouped ? ` (${objektsFiltered.length} grouped)` : ""}
        </span>
      </div>

      <ObjektModalProvider initialTab="owned">
        <WindowVirtualizer>{virtualList}</WindowVirtualizer>
      </ObjektModalProvider>
    </div>
  );
}
