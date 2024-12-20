import { desc } from "drizzle-orm";
import { indexer } from "../db/indexer";
import { collections } from "../db/indexer/schema";

export async function fetchObjektsIndex() {
  const result = await indexer
    .select()
    .from(collections)
    .orderBy(desc(collections.createdAt));

  return result;
}
