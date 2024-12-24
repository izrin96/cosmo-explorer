import { indexer } from "@/lib/server/db/indexer";
import {
  objekts,
  transfers,
  collections,
} from "@/lib/server/db/indexer/schema";
import { APOLLO_ENDPOINT } from "@/lib/utils";
import { and, eq } from "drizzle-orm";
import { ofetch } from "ofetch";

export const runtime = "nodejs";

type Params = {
  params: Promise<{
    collectionSlug: string;
    serial: string;
  }>;
};

type FetchUserByAddressResult = {
  result: {
    nickname: string;
    address: string;
  };
};

export async function GET(_: Request, props: Params) {
  const params = await props.params;

  const results = await indexer
    .select({
      id: transfers.id,
      to: transfers.to,
      timestamp: transfers.timestamp,
    })
    .from(transfers)
    .leftJoin(objekts, eq(transfers.objektId, objekts.id))
    .leftJoin(collections, eq(objekts.collectionId, collections.id))
    .where(
      and(
        eq(collections.slug, params.collectionSlug),
        eq(objekts.serial, parseInt(params.serial))
      )
    );

  const users = (
    await Promise.all(
      results.map((user) =>
        ofetch<FetchUserByAddressResult>(
          `${APOLLO_ENDPOINT}/api/user/by-address/${user.to}`
        ).then((res) => res.result)
      )
    )
  ).filter((user) => user);

  const newResults = results.map((res) => {
    return {
      ...res,
      user: users.find((user) => user.address.toLowerCase() == res.to),
    };
  });

  return Response.json({ transfers: newResults });
}
