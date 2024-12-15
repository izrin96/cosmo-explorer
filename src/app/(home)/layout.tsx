import React, { PropsWithChildren } from "react";

type Props = PropsWithChildren;

export default async function ProfileLayout(props: Props) {
  return (
    <main className="relative container flex flex-col gap-2 py-2">
      {props.children}
    </main>
  );
}
