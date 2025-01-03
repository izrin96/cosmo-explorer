import {
  getArtistsWithMembers,
  getUserByIdentifier,
} from "@/app/data-fetching";
import ProfileObjekt from "@/components/profile/profile-objekt";
import { Metadata } from "next";

type Props = {
  params: Promise<{
    nickname: string;
  }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const profile = await getUserByIdentifier(params.nickname);

  return {
    title: `${profile.nickname}'s Collection`,
  };
}

export default async function UserCollectionPage(props: Props) {
  const params = await props.params;

  const [targetUser, artists] = await Promise.all([
    getUserByIdentifier(params.nickname),
    getArtistsWithMembers(),
  ]);

  return (
    <>
      <ProfileObjekt profile={targetUser} artists={artists} />
    </>
  );
}
