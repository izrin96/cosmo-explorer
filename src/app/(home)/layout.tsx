import { Container } from "@/components/ui";
import React, { PropsWithChildren } from "react";

type Props = PropsWithChildren;

export default async function ProfileLayout(props: Props) {
  return (
    <Container>
      {props.children}
    </Container>
  );
}
