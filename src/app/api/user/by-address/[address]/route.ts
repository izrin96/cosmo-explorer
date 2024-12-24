import { APOLLO_ENDPOINT } from "@/lib/utils";
import { ofetch } from "ofetch";

export const runtime = "nodejs";

type Params = {
  params: Promise<{
    address: string;
  }>;
};

type FetchUserByAddressResult = {
  result: {
    nickname: string;
    address: string;
  };
};

export async function GET(_: Request, props: Params) {
  const params = await props.params;
  const [objektMetadata] = await Promise.all([
    fetchUserByAddress(params.address),
  ]);

  return Response.json(objektMetadata);
}

async function fetchUserByAddress(address: string) {
  // this is temporary, maybe
  return await ofetch<FetchUserByAddressResult>(
    `${APOLLO_ENDPOINT}/api/user/by-address/${address}`
  );
}
