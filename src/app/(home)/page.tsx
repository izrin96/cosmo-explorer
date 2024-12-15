import IndexView from "@/components/index/index-view";
import { IndexedObjekt } from "@/lib/universal/objekts";
import { getBaseURL } from "@/lib/utils";
import { ofetch } from "ofetch";
import { getArtistsWithMembers } from "../data-fetching";

export default async function Home() {
  const getObjekts = async () => {
    return await ofetch<IndexedObjekt[]>(`${getBaseURL()}/objekts.json`);
  };
  
  const [objekts, artists] = await Promise.all([
    getObjekts(),
    getArtistsWithMembers(),
  ]);

  return <IndexView objekts={objekts} artists={artists} />;
}
