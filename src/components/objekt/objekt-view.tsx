import { CSSProperties, memo, useState } from "react";
import { default as NextImage } from "next/image";
import { getCollectionShortId, ValidObjekt } from "@/lib/universal/objekts";
import { OwnedObjekt } from "@/lib/universal/cosmo/objekts";
import { getObjektArtist, getObjektImageUrls, getObjektType } from "./objekt-util";
import { Badge, GridList, Tabs } from "../ui";
import { Modal } from "../ui";

type Props = {
  objekts: ValidObjekt[];
  isOwned?: boolean;
  showSerial?: boolean;
  priority?: boolean
};

const MemoizedImage = memo(NextImage);

export default memo(function ObjektView({
  objekts,
  isOwned = false,
  showSerial = false,
  priority = false,
}: Props) {
  const [objekt] = objekts;
  const [flipped, setFlipped] = useState(false);
  const [open, setOpen] = useState(false);

  const css = {
    "--objekt-background-color": objekt.backgroundColor,
    "--objekt-text-color": objekt.textColor,
  } as CSSProperties;
  
  const { front } = getObjektImageUrls(objekt);

  return (
    <div style={css}>
      <div className="flex flex-col gap-2">
        <div className="relative overflow-hidden aspect-photocard drop-shadow">
          <MemoizedImage
            fill
            priority={priority}
            src={front.display}
            alt={objekt.collectionId}
            onClick={() => setOpen(true)}
            className="cursor-pointer"
          />
          {objekts.length > 1 && (
            <div className="flex absolute top-2 left-2 rounded-full px-2 py-1 justify-center items-center font-bold text-[var(--objekt-text-color)] bg-[var(--objekt-background-color)] text-xs">
              {objekts.length}
            </div>
          )}
        </div>
        <div className="flex justify-center text-sm text-center">
          <Badge intent="secondary" className="font-semibold" shape="square">
            {`${getCollectionShortId(objekt)}`}
            {showSerial && ` #${(objekt as OwnedObjekt).objektNo}`}
          </Badge>
        </div>
      </div>

      <Modal.Content isOpen={open} onOpenChange={setOpen} size="3xl">
        <Modal.Header className="hidden">
          <Modal.Title>Objekt display</Modal.Title>
        </Modal.Header>
        <Modal.Body className="flex flex-col md:flex-row my-4">
          <div className="flex h-[23rem] md:h-[28rem] aspect-photocard self-center">
            <div
              onClick={() => setFlipped((prev) => !prev)}
              data-flipped={flipped}
              className="relative h-full aspect-photocard cursor-pointer touch-manipulation transition-transform preserve-3d transform-gpu duration-300 data-[flipped=true]:rotate-y-180"
            >
              <div className="absolute inset-0 backface-hidden drop-shadow">
                <MemoizedImage
                  fill
                  src={objekt.frontImage}
                  alt={objekt.collectionId}
                />
              </div>
              <div className="absolute inset-0 backface-hidden rotate-y-180 drop-shadow">
                <MemoizedImage
                  fill
                  src={objekt.backImage}
                  alt={objekt.collectionId}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col grow h-[23rem] md:h-[28rem] overflow-y-auto">
            <AttributePanel objekt={objekt} />
            {/* <Separator orientation="horizontal" /> */}
            <Tabs
              aria-label="Objekt tab"
              defaultSelectedKey={isOwned ? "owned" : "metadata"}
              className="m-3"
            >
              <Tabs.List>
                {isOwned && <Tabs.Tab id="owned">Owned</Tabs.Tab>}
                <Tabs.Tab id="metadata">Metadata</Tabs.Tab>
                <Tabs.Tab id="trades">Trades</Tabs.Tab>
              </Tabs.List>
              {isOwned && (
                <Tabs.Panel id="owned">
                  <OwnedListPanel objekts={objekts as OwnedObjekt[]} />
                </Tabs.Panel>
              )}
              <Tabs.Panel id="metadata">
                <MetadataPanel />
              </Tabs.Panel>
              <Tabs.Panel id="trades">Not yet available</Tabs.Panel>
            </Tabs>
          </div>
        </Modal.Body>
      </Modal.Content>
    </div>
  );
});

type AttributeProps = {
  objekt: ValidObjekt;
};

function AttributePanel({ objekt }: AttributeProps) {
  const artist = getObjektArtist(objekt);
  const onOffline = getObjektType(objekt);
  return (
    <div className="flex flex-wrap gap-2 m-3">
      <Pill label="Artist" value={artist} />
      <Pill label="Member" value={objekt.member} />
      <Pill label="Season" value={objekt.season} />
      <Pill label="Class" value={objekt.class} />
      {objekt.class === "First" && (
        <Pill label="Edition" value={getEdition(objekt.collectionNo)} />
      )}
      <Pill
        label="Type"
        value={onOffline === "online" ? "Digital" : "Physical"}
      />
      <Pill label="Collection No." value={objekt.collectionNo} />
      <PillColor
        label="Accent Color"
        value={objekt.accentColor}
        objekt={objekt}
      />
      <Pill label="Text Color" value={objekt.textColor} />
    </div>
  );
}

function MetadataPanel() {
  return <div>Not yet available</div>;
}

type OwnedListPanelProps = {
  objekts: OwnedObjekt[];
};

function OwnedListPanel({ objekts }: OwnedListPanelProps) {
  return (
    <GridList
      selectionMode="multiple"
      items={objekts}
      aria-label="Select your favorite bands"
      className="min-w-64"
    >
      {(item) => (
        <GridList.Item textValue={"" + item.objektNo} id={item.tokenId}>
          #{item.objektNo}
        </GridList.Item>
      )}
    </GridList>
  );
}

type PillProps = {
  label: string;
  value: string;
  objekt?: ValidObjekt;
};

function Pill({ label, value }: PillProps) {
  return (
    <Badge intent="secondary" className="">
      <span className="font-semibold">{label}</span>
      <span>{value}</span>
    </Badge>
  );
}

function PillColor({ label, value, objekt }: PillProps) {
  return (
    <div>
      <Badge
        shape="circle"
        style={
          {
            "--objekt-accent-color": objekt?.accentColor,
            "--objekt-text-color": objekt?.textColor,
          } as CSSProperties
        }
        className="!bg-[var(--objekt-accent-color)] !text-[var(--objekt-text-color)]"
      >
        <span className="font-semibold">{label}</span>
        <span>{value}</span>
      </Badge>
    </div>
  );
}

const rarityMap = {
  // grey - consumer
  common: {
    label: "Common",
    color: "#afafaf",
  },
  // light blue - industrial
  // uncommon: {
  //   label: "Uncommon",
  //   color: "#6496e1",
  // },
  // blue - milspec
  uncommon: {
    label: "Uncommon",
    color: "#4b69cd",
  },
  // purple - restricted
  rare: {
    label: "Rare",
    color: "#8847ff",
  },
  // pink - classified
  "very-rare": {
    label: "Very Rare",
    color: "#d32ce6",
  },
  // red - covert
  "extremely-rare": {
    label: "Extremely Rare",
    color: "#eb4b4b",
  },
  // gold - contraband
  impossible: {
    label: "Impossible",
    color: "#e3c427",
  },
};
type Rarity = keyof typeof rarityMap;

export function RarityPill({ rarity }: { rarity: Rarity }) {
  const { label, color } = rarityMap[rarity];

  return (
    <div
      style={{ backgroundColor: color }}
      className="flex items-center gap-1 rounded-full px-2 py-1 text-sm text-white w-fit"
    >
      <span className="font-semibold">{label}</span>
    </div>
  );
}

// counter-strike style rarity system
function getRarity(copies: number): Rarity {
  if (copies <= 10) {
    return "impossible";
  }
  if (copies <= 25) {
    return "extremely-rare";
  }
  if (copies <= 50) {
    return "very-rare";
  }
  if (copies <= 100) {
    return "rare";
  }
  if (copies <= 350) {
    return "uncommon";
  }
  return "common";
}

function getEdition(collectionNo: string): string {
  const collection = parseInt(collectionNo);

  if (collection >= 101 && collection <= 108) {
    return "1st";
  }
  if (collection >= 109 && collection <= 116) {
    return "2nd";
  }
  if (collection >= 117 && collection <= 120) {
    return "3rd";
  }
  return "Unknown";
}
