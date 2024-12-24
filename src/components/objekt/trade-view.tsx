"use client";

import { useQuery } from "@tanstack/react-query";
import { ofetch } from "ofetch";
import React, { useMemo, useState } from "react";
import { Badge, Button, Card, Loader, NumberField, Table } from "../ui";
import { IconArrowLeft, IconArrowRight } from "justd-icons";
import { format } from "date-fns";
import Link from "next/link";

type TradeViewProps = {
  slug: string;
  initialSerial?: number;
};

type Objekts = {
  serial: number;
  owner: string;
  transferable: boolean;
};

type ObjektTransfers = {
  id: string;
  to: string;
  timestamp: Date;
  user?: {
    nickname: string;
    address: string;
  };
};

export default function TradeView({ slug, initialSerial }: TradeViewProps) {
  const { data } = useQuery({
    queryKey: ["collection-metadata", "list", slug],
    queryFn: async ({ signal }) =>
      await ofetch<{ objekts: Objekts[] }>(`/api/objekts/list/${slug}`, {
        signal,
      }).then((res) => res.objekts),
  });

  const objekts = useMemo(() => data ?? [], [data]);

  return (
    <>
      {objekts.length > 0 && (
        <Trades
          objekts={objekts}
          initialSerial={initialSerial ?? objekts[0].serial}
          slug={slug}
        />
      )}
    </>
  );
}

function Trades({
  objekts,
  initialSerial,
  slug,
}: {
  objekts: Objekts[];
  initialSerial: number;
  slug: string;
}) {
  const [serial, setSerial] = useState(initialSerial);

  const objekt = useMemo(
    () => objekts.find((objekt) => objekt.serial === serial),
    [serial, objekts]
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <Button
          size="square-petite"
          appearance="outline"
          className="flex-none"
          onPress={() =>
            setSerial((prevSerial) => {
              const newSerial = objekts
                .map((objekt) => objekt.serial)
                .filter((serial) => serial < prevSerial)
                .pop();
              return newSerial ?? prevSerial;
            })
          }
        >
          <IconArrowLeft />
        </Button>
        <NumberField
          autoFocus
          minValue={1}
          className="grow"
          aria-label="Serial no."
          value={serial}
          onChange={setSerial}
        />
        <Button
          size="square-petite"
          appearance="outline"
          className="flex-none"
          onPress={() =>
            setSerial((prevSerial) => {
              const newSerial = objekts
                .map((objekt) => objekt.serial)
                .filter((serial) => serial > prevSerial)?.[0];
              return newSerial ?? prevSerial;
            })
          }
        >
          <IconArrowRight />
        </Button>
      </div>

      {objekt && (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-sm">Owner</span>
            <span>
              <UserLink address={objekt.owner} />
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-sm">Transferable</span>
            <Badge
              className="text-sm"
              shape="square"
              intent={objekt.transferable ? "primary" : "danger"}
            >
              {objekt.transferable ? "Yes" : "No"}
            </Badge>
          </div>
        </div>
      )}

      <TradeTable slug={slug} serial={serial} />
    </div>
  );
}

function TradeTable({ slug, serial }: { slug: string; serial: number }) {
  const { data, isFetching } = useQuery({
    queryFn: async ({ signal }) =>
      await ofetch<{ transfers: ObjektTransfers[] }>(
        `/api/objekts/transfers/${slug}/${serial}`,
        {
          signal,
        }
      ).then((res) => res.transfers),
    queryKey: ["collection-metadata", "transfers", slug, serial],
    enabled: serial > 0,
  });

  return (
    <>
      {isFetching && (
        <div className="self-center">
          <Loader />
        </div>
      )}

      {!isFetching && (
        <Card>
          <Table allowResize aria-label="Trades">
            <Table.Header>
              <Table.Column isRowHeader isResizable>
                Owner
              </Table.Column>
              <Table.Column>Date</Table.Column>
            </Table.Header>
            <Table.Body items={data}>
              {(item) => (
                <Table.Row id={item.id}>
                  <Table.Cell>
                    <UserLink address={item.to} />
                  </Table.Cell>
                  <Table.Cell>
                    {format(item.timestamp, "MMMM do, yyyy hh:mm:ss a")}
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </Card>
      )}
    </>
  );
}

type FetchUserByAddressResult = {
  result: {
    nickname: string;
    address: string;
  };
};

function UserLink({ address }: { address: string }) {
  const { data, isPending } = useQuery({
    queryFn: async ({ signal }) =>
      await ofetch<FetchUserByAddressResult>(
        `/api/user/by-address/${address}`,
        {
          signal,
        }
      ).then((res) => res.result),
    queryKey: ["collection-metadata", "transfers", "user", address],
  });

  if (isPending) return <Loader />;

  return (
    <Link href={`/@${data?.nickname ?? address}`}>
      {data?.nickname ?? address}
    </Link>
  );
}
