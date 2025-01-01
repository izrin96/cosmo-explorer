import { useQuery } from "@tanstack/react-query";
import { ofetch } from "ofetch";
import { Skeleton } from "./ui";
import Link from "next/link";

type FetchUserByAddressResult = {
  result: {
    nickname: string;
    address: string;
  };
};

export default function UserLink({ address }: { address: string }) {
  const { data, isPending } = useQuery({
    queryFn: async () =>
      await ofetch<FetchUserByAddressResult>(
        `/api/user/by-address/${address}`
      ).then((res) => res.result),
    queryKey: ["user-link", address],
  });

  if (isPending) return <Skeleton className="w-10 h-3" />;

  return (
    <Link href={`/@${data?.nickname ?? address}`}>
      {data?.nickname ?? address.substring(0, 6)}
    </Link>
  );
}
