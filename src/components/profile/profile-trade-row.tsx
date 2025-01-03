"use client";

import { Badge, Link } from "../ui";
import { AggregatedTransfer } from "@/lib/universal/transfers";
import UserLink from "../user-link";
import { format } from "date-fns";
import { getCollectionShortId, ValidObjekt } from "@/lib/universal/objekts";
import { memo, useState } from "react";
import { ObjektModal } from "../objekt/objekt-view";
import { IconOpenLink } from "justd-icons";

const nullAddress = "0x0000000000000000000000000000000000000000";

type Props = {
  row: AggregatedTransfer;
  address: string;
};

export default memo(function TradeRow({ row, address }: Props) {
  const [open, setOpen] = useState(false);
  const isReceiver = row.transfer.to.toLowerCase() === address.toLowerCase();

  const tdClass = "group whitespace-nowrap px-3 py-3";

  // const serial = row.serial?.toString().padStart(5, "0");
  const name = row.collection
    ? `${getCollectionShortId(row.collection)}`
    : "Unknown";

  const action = isReceiver ? (
    <Badge className="bg-sky-500/15 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
      Received From
    </Badge>
  ) : (
    <Badge className="bg-pink-500/15 text-pink-700 dark:bg-pink-500/10 dark:text-pink-300">
      Sent To
    </Badge>
  );

  const onOpen = () => setOpen(true);

  const user = isReceiver ? (
    row.transfer.from === nullAddress ? (
      <span>COSMO</span>
    ) : (
      <UserLink address={row.transfer.from} />
    )
  ) : (
    <UserLink address={row.transfer.to} />
  );

  return (
    <>
      <tr className="tr group relative border-b bg-bg text-fg">
        <td className={tdClass}>
          {format(row.transfer.timestamp, "yyyy/MM/dd hh:mm:ss a")}
        </td>
        <td className={tdClass}>
          <Link
            onPress={onOpen}
            className="cursor-pointer inline-flex gap-2 items-center"
          >
            {name}
            <IconOpenLink />
          </Link>
        </td>
        <td className={tdClass}>{row.serial}</td>
        <td className={tdClass}>{action}</td>
        <td className={tdClass}>{user}</td>
      </tr>

      {row.collection && (
        <ObjektModal
          open={open}
          isOwned
          objekts={[
            {
              ...row.collection,
              artists: [row.collection.artist],
              objektNo: row.serial,
            } as ValidObjekt,
          ]}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
});
