import { indexer } from "@/lib/server/db/indexer";
import {
  objekts,
  transfers,
  collections,
} from "@/lib/server/db/indexer/schema";
import { and, eq, asc } from "drizzle-orm";

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
    )
    .orderBy(asc(transfers.timestamp));

  return Response.json({ transfers: results });
}
