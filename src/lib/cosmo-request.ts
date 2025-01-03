import { ofetch } from "ofetch";

import { COSMO_ENDPOINT } from "./universal/cosmo/common";
import { OwnedObjektsResult } from "./universal/cosmo/objekts";
import { parsePage } from "./universal/objekts";

const RESULT_OBJEKTS_COUNT = 30;
const PARALLEL_REQUEST_COUNT = 5;

type OwnedObjektRequest = {
  address: string;
  startAfter: number;
};

export async function fetchOwnedObjekts({
  address,
  startAfter,
}: OwnedObjektRequest) {
  const endpoint = `${COSMO_ENDPOINT}/objekt/v1/owned-by/${address}`;
  return await ofetch(endpoint, {
    query: {
      start_after: `${startAfter}`,
      sort: "newest",
    },
  })
    .then((res) => parsePage<OwnedObjektsResult>(res))
    .then((res) => ({
      ...res,
      objekts: res.objekts.map((objekt) => {
        // temporary fix accent color for below collection
        if (
          [
            "Divine01 SeoYeon 117Z",
            "Divine01 SeoYeon 118Z",
            "Divine01 SeoYeon 119Z",
            "Divine01 SeoYeon 120Z",
          ].includes(objekt.collectionId)
        ) {
          return {
            ...objekt,
            backgroundColor: "#B400FF",
            accentColor: "#B400FF",
          };
        }

        return objekt;
      }),
    }));
}

export async function fetchOwnedObjektsParallel({
  address,
  startAfter,
}: OwnedObjektRequest) {
  const results = await Promise.all(
    Array.from({ length: PARALLEL_REQUEST_COUNT }).map((_, i) =>
      fetchOwnedObjekts({
        address: address,
        startAfter: startAfter + RESULT_OBJEKTS_COUNT * i,
      })
    )
  );

  return {
    ...results[results.length - 1],
    objekts: results.flatMap((result) => result.objekts),
  } satisfies OwnedObjektsResult;
}
