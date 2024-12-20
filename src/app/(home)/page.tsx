import IndexView from "@/components/index/index-view";
import { getArtistsWithMembers } from "../data-fetching";
import { fetchObjektsIndex } from "@/lib/server/objekts/objekt-index";

export const revalidate = 60

export default async function Home() {
  const [objekts, artists] = await Promise.all([
    fetchObjektsIndex(),
    getArtistsWithMembers(),
  ]);

  return (
    <>
      <div className="py-1"></div>
      <IndexView objekts={objekts} artists={artists} />
    </>
  );
}
