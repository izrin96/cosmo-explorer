import { indexer } from "@/lib/server/db/indexer";
import { objekts, transfers, collections } from "@/lib/server/db/indexer/schema";
import { and, eq } from "drizzle-orm";

export const runtime = "nodejs";

type Params = {
  params: Promise<{
    collectionSlug: string;
    serial: string;
  }>;
};

export async function GET(_: Request, props: Params) {
  const params = await props.params;

  const results = await indexer
    .select({
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

  return Response.json({
    results,
  });
}