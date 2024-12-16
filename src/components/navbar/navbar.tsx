import { Container } from "../ui";
import UserSearch from "../user-search";
import Link from "next/link";

export default async function Navbar() {
  return (
    <nav className="sticky left-0 right-0 top-0 h-14 z-30 bg-bg/80">
      <Container className="flex justify-center">
        <div className="grow gap-4 flex items-center h-14">
          <Link href="/">
            <span className="font-semibold text-xl">Lunar</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <UserSearch />
        </div>
      </Container>
    </nav>
  );
}
