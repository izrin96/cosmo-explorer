import { Container } from "@/components/ui";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren;

export default async function ProfileLayout(props: Props) {
  return (
    <Container>
      {props.children}
    </Container>
  );
}
