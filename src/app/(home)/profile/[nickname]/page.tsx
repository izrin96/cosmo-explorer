import {
  getArtistsWithMembers,
  getUserByIdentifier,
} from "@/app/data-fetching";
import ProfileView from "@/components/profile/profile-view";
import { fetchOwnedObjekts } from "@/lib/cosmo-request";

type Props = {
  params: Promise<{
    nickname: string;
  }>;
};

export default async function UserCollectionPage(props: Props) {
  const params = await props.params;

  const [targetUser, artists] = await Promise.all([
    getUserByIdentifier(params.nickname),
    getArtistsWithMembers(),
  ]);

  const initialData = await fetchOwnedObjekts({
    address: targetUser.address,
    startAfter: 0,
  });

  return (
    <>
      <div className="text-xl font-semibold">{params.nickname}</div>
      <div className="overflow-auto text-xs text-muted-fg">
        {targetUser.address}
      </div>
      <div className="py-2"></div>
      <ProfileView
        profile={targetUser}
        artists={artists}
        initialData={initialData}
      />
    </>
  );
}
