import { ObjektMetadata } from "@/lib/universal/objekts";
import { APOLLO_ENDPOINT } from "@/lib/utils";
import { ofetch } from "ofetch";

export const runtime = "nodejs";

type Params = {
  params: Promise<{
    collectionSlug: string;
  }>;
};

export async function GET(_: Request, props: Params) {
  const params = await props.params;
  const [objektMetadata] = await Promise.all([
    fetchCollectionMetadata(params.collectionSlug),
  ]);

  return Response.json(objektMetadata);
}

async function fetchCollectionMetadata(slug: string) {
  // this is temporary, maybe
  return await ofetch<ObjektMetadata>(
    `${APOLLO_ENDPOINT}/api/objekts/metadata/${slug}`
  );
}
