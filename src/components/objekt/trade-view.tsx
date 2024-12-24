"use client";

import { useQuery } from "@tanstack/react-query";
import { ofetch } from "ofetch";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, NumberField, Table } from "../ui";
import { IconArrowLeft, IconArrowRight, IconSearch } from "justd-icons";
import { format } from "date-fns";

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
  const [currentSerial, setCurrentSerial] = useState(initialSerial ?? 1);
  const { data } = useQuery({
    queryKey: ["collection-metadata", "list", slug],
    queryFn: async () =>
      await ofetch<{ objekts: Objekts[] }>(`/api/objekts/list/${slug}`).then(
        (res) => res.objekts
      ),
  });

  const objekts = useMemo(() => data ?? [], [data]);

  useEffect(() => {
    if (!initialSerial && objekts.length > 0)
      setCurrentSerial(objekts[0].serial);
  }, [objekts, initialSerial]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <Button
          size="square-petite"
          appearance="outline"
          className="flex-none"
          onPress={() =>
            setCurrentSerial((prevSerial) => {
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
          minValue={1}
          className="grow"
          aria-label="Serial no."
          value={currentSerial}
          onChange={setCurrentSerial}
        />
        {/* <Button size="square-petite" appearance="solid" className="flex-none">
          <IconSearch />
        </Button> */}
        <Button
          size="square-petite"
          appearance="outline"
          className="flex-none"
          onPress={() =>
            setCurrentSerial((prevSerial) => {
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

      <TradeTable serial={currentSerial} slug={slug} />
    </div>
  );
}

function TradeTable({ serial, slug }: { serial: number; slug: string }) {
  const { data } = useQuery({
    queryFn: async () =>
      await ofetch<{ transfers: ObjektTransfers[] }>(
        `/api/objekts/transfers/${slug}/${serial}`
      ).then((res) => res.transfers),
    queryKey: ["collection-metadata", "transfers", slug, serial],
    enabled: serial > 0
  });

  return (
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
              <Table.Cell>{item.user?.nickname ?? item.to}</Table.Cell>
              <Table.Cell>
                {format(item.timestamp, "MMMM do, yyyy hh:mm:ss a")}
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Card>
  );
}
