import React, { CSSProperties, memo, useState } from "react";
import { default as NextImage } from "next/image";
import { ValidObjekt } from "@/lib/universal/objekts";
import { OwnedObjekt } from "@/lib/universal/cosmo/objekts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import VisuallyHidden from "../ui/visually-hidden";
import { getObjektArtist, getObjektType } from "./objekt-util";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

type ValidObjektWithId = ValidObjekt & { collectionShortId: string };
type OwnedObjektWithId = OwnedObjekt & { collectionShortId: string };

type Props = {
  objekts: ValidObjektWithId[];
  isOwned?: boolean;
  showSerial?: boolean;
};

const MemoizedImage = memo(NextImage);

export default function ObjektView({ objekts, isOwned = false, showSerial = false }: Props) {
  const [objekt] = objekts;
  const [flipped, setFlipped] = useState(false);
  const [open, setOpen] = useState(false);
  function onOpenChange(state: boolean) {
    setOpen(state);
  }

  const css = {
    "--objekt-background-color": objekt.backgroundColor,
    "--objekt-text-color": objekt.textColor,
  } as CSSProperties;

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="relative overflow-hidden aspect-photocard">
          <MemoizedImage
            fill
            src={objekt.thumbnailImage}
            alt={objekt.collectionId}
            onClick={() => setOpen(true)}
            className="cursor-pointer"
          />
        </div>
        <div className="flex justify-center text-sm">
          {objekt.collectionShortId}
          {showSerial && ` #${(objekt as OwnedObjekt).objektNo}`}
        </div>
      </div>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl p-0 gap-0">
          <VisuallyHidden>
            <DialogTitle>{objekt.collectionId}</DialogTitle>
            <DialogDescription>{objekt.collectionId}</DialogDescription>
          </VisuallyHidden>
          <div className="flex flex-col md:flex-row">
            <div className="flex h-[23rem] md:h-[28rem] aspect-photocard self-center">
              <div
                onClick={() => setFlipped((prev) => !prev)}
                data-flipped={flipped}
                style={css}
                className="relative h-full aspect-photocard cursor-pointer touch-manipulation transition-transform preserve-3d transform-gpu duration-300 data-[flipped=true]:rotate-y-180"
              >
                <div className="absolute inset-0 backface-hidden">
                  <MemoizedImage
                    fill
                    src={objekt.frontImage}
                    alt={objekt.collectionId}
                  />
                </div>
                <div className="absolute inset-0 backface-hidden rotate-y-180">
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
              <Separator orientation="horizontal" />
              <Tabs
                defaultValue={isOwned ? "owned" : "metadata"}
                className="m-3"
              >
                <TabsList>
                  {isOwned && <TabsTrigger value="owned">Owned</TabsTrigger>}
                  <TabsTrigger value="metadata">Metadata</TabsTrigger>
                  <TabsTrigger value="trades">Trades</TabsTrigger>
                </TabsList>
                {isOwned && (
                  <TabsContent value="owned">
                    <OwnedListPanel objekts={objekts as OwnedObjektWithId[]} />
                  </TabsContent>
                )}
                <TabsContent value="metadata">
                  <MetadataPanel />
                </TabsContent>
                <TabsContent value="trades">not yet available</TabsContent>
              </Tabs>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

type AttributeProps = {
  objekt: ValidObjektWithId;
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
      {/* todo: copies */}
      {/* todo: tradable */}
      {/* todo: rarity */}
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
  return <div>Metadata not yet available</div>;
}

type OwnedListPanelProps = {
  objekts: OwnedObjektWithId[];
};

function OwnedListPanel({ objekts }: OwnedListPanelProps) {
  return (
    <div>
      <ul>
        {objekts.map((objekt) => (
          <li key={objekt.tokenId}>{objekt.objektNo}</li>
        ))}
      </ul>
    </div>
  );
}

type PillProps = {
  label: string;
  value: string;
  objekt?: ValidObjekt;
};

function Pill({ label, value }: PillProps) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-accent px-2 py-1 text-sm">
      <span className="font-semibold">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function PillColor({ label, value, objekt }: PillProps) {
  return (
    <div
      className="flex items-center gap-1 rounded-full bg-[var(--objekt-accent-color)] px-2 py-1 text-sm text-[var(--objekt-text-color)]"
      style={
        {
          "--objekt-accent-color": objekt?.accentColor,
          "--objekt-text-color": objekt?.textColor,
        } as CSSProperties
      }
    >
      <span className="font-semibold">{label}</span>
      <span>{value}</span>
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
