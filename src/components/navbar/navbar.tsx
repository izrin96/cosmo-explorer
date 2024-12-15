import { Container } from "../ui";

export default async function Navbar() {
  return (
    <nav className="sticky left-0 right-0 top-0 h-14 z-30 bg-bg/80">
      <Container className="flex justify-center">
        <div className="grow gap-2 flex items-center h-14">
          <div>
            <span className="font-semibold text-xl">Lunar</span>
          </div>
          <div>{/* search here */}</div>
        </div>
        <div className="flex items-center gap-2">{/* auth */}</div>
      </Container>
    </nav>
  );
}
