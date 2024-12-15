import {
  getArtistsWithMembers,
  getUserByIdentifier,
} from "@/app/data-fetching";
import ProfileView from "@/components/profile/profile-view";

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

  return (
    <>
      <div>User: {params.nickname}</div>
      <div className="overflow-auto">Address: {targetUser.address}</div>
      <ProfileView profile={targetUser} artists={artists} />
    </>
  );
}
