import IndexView from "@/components/index/index-view";
import { IndexedObjekt } from "@/lib/universal/objekts";
import { getBaseURL } from "@/lib/utils";
import { ofetch } from "ofetch";

export default async function Home() {
  const getObjekts = async () => {
    return await ofetch<IndexedObjekt[]>(`${getBaseURL()}/objekts.json`);
  };
  const [objekts] = await Promise.all([getObjekts()]);
  return <IndexView objekts={objekts} />;
}
