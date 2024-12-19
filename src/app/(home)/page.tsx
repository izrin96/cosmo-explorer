import IndexView from "@/components/index/index-view";
import { IndexedObjekt } from "@/lib/universal/objekts";
import { getBaseURL } from "@/lib/utils";
import { ofetch } from "ofetch";
import { getArtistsWithMembers } from "../data-fetching";

export const dynamic = "force-dynamic";

export default async function Home() {
  const getObjekts = async () => {
    const url = new URL("/objekts.json", getBaseURL());
    return await ofetch<IndexedObjekt[]>(url.toString());
  };

  const [objekts, artists] = await Promise.all([
    getObjekts(),
    getArtistsWithMembers(),
  ]);

  return (
    <>
      <div className="py-1"></div>
      <IndexView objekts={objekts} artists={artists} />
    </>
  );
}
