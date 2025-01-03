import { useQuery } from "@tanstack/react-query";
import { ofetch } from "ofetch";
import { Skeleton, Tooltip } from "./ui";
import { IconCircleInfo } from "justd-icons";
import Link from "next/link";

type FetchUserByAddressResult = {
  result: {
    nickname: string;
    address: string;
  };
};

export default function UserLink({ address }: { address: string }) {
  // const { data, isPending } = useQuery({
  //   queryFn: async () =>
  //     await ofetch<FetchUserByAddressResult>(
  //       `/api/user/by-address/${address}`
  //     ).then((res) => res.result),
  //   queryKey: ["user-link", address],
  // });

  // if (isPending) return <Skeleton className="w-10 h-3" />;

  const data = null as any;

  return (
    <div className="inline-flex gap-2">
      <Link href={`/@${data?.nickname ?? address}`}>
        {data?.nickname ?? address.substring(0, 6)}
      </Link>

      <Tooltip delay={0} closeDelay={0}>
        <Tooltip.Trigger aria-label="Preview">
          <IconCircleInfo />
        </Tooltip.Trigger>
        <Tooltip.Content>
          Displayed as a wallet address. Nickname is not available yet.
        </Tooltip.Content>
      </Tooltip>
    </div>
  );
}
