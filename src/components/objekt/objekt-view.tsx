import {
  CSSProperties,
  memo,
  PropsWithChildren,
  useCallback,
  useState,
  useTransition,
} from "react";
import { default as NextImage } from "next/image";
import {
  getCollectionShortId,
  ObjektMetadata,
  ValidObjekt,
} from "@/lib/universal/objekts";
import { OwnedObjekt } from "@/lib/universal/cosmo/objekts";
import {
  getObjektArtist,
  getObjektImageUrls,
  getObjektSlug,
  getObjektType,
} from "./objekt-util";
import { Badge, Button, GridList, Skeleton, Tabs } from "../ui";
import { Modal } from "../ui";
import { useQuery } from "@tanstack/react-query";
import { ofetch } from "ofetch";
import { IconBrokenChainLink } from "justd-icons";
import Tilt from "react-parallax-tilt";
import TradeView from "./trade-view";

type Props = {
  objekts: ValidObjekt[];
  isOwned?: boolean;
  showSerial?: boolean;
  priority?: boolean;
  setActive?: (slug: string | null) => void;
};

const MemoizedImage = memo(NextImage);

export default memo(function ObjektView({
  objekts,
  isOwned = false,
  showSerial = false,
  priority = false,
  setActive,
}: Props) {
  const [objekt] = objekts;
  const [open, setOpen] = useState(false);
  const [_, startTransition] = useTransition();

  const css = {
    "--objekt-background-color": objekt.backgroundColor,
    "--objekt-text-color": objekt.textColor,
  } as CSSProperties;

  const slug = getObjektSlug(objekt);

  const { front } = getObjektImageUrls(objekt);

  const onClick = useCallback(() => {
    startTransition(() => {
      setOpen(true);
      if (setActive) {
        setActive(slug);
      }
    });
  }, [setOpen, setActive, slug]);

  return (
    <div style={css}>
      <div className="flex flex-col gap-2">
        <Tilt
          tiltReverse
          scale={1.08}
          transitionSpeed={2000}
          glareEnable
          glarePosition="bottom"
          glareBorderRadius="12px"
        >
          <div className="relative overflow-hidden aspect-photocard drop-shadow">
            <MemoizedImage
              fill
              priority={priority}
              src={front.display}
              alt={objekt.collectionId}
              onClick={onClick}
              className="cursor-pointer"
            />
            {objekts.length > 1 && (
              <div className="flex absolute top-2 left-2 rounded-full px-2 py-1 justify-center items-center font-bold text-[var(--objekt-text-color)] bg-[var(--objekt-background-color)] text-xs">
                {objekts.length}
              </div>
            )}
          </div>
        </Tilt>
        <div className="flex justify-center text-sm text-center">
          <Badge
            intent="secondary"
            className="font-semibold cursor-pointer"
            shape="square"
            onClick={onClick}
          >
            {`${getCollectionShortId(objekt)}`}
            {showSerial && ` #${(objekt as OwnedObjekt).objektNo}`}
          </Badge>
        </div>
      </div>

      <ObjektModal
        open={open}
        isOwned={isOwned}
        objekts={objekts}
        onClose={() => {
          startTransition(() => {
            setOpen(false);
            if (setActive) {
              setActive(null);
            }
          });
        }}
      />
    </div>
  );
});

type ObjektModalProps = {
  open: boolean;
  objekts: ValidObjekt[];
  onClose?: () => void;
  isOwned?: boolean;
};

export function ObjektModal({
  open,
  objekts,
  onClose,
  isOwned = false,
}: ObjektModalProps) {
  return (
    <Modal.Content
      isOpen={open}
      onOpenChange={(state) => {
        if (state === false && onClose) {
          onClose();
        }
      }}
      size="4xl"
    >
      <Modal.Header className="hidden">
        <Modal.Title>Objekt display</Modal.Title>
      </Modal.Header>
      <Modal.Body className="flex flex-col sm:flex-row p-2 sm:p-3 min-h-dvh sm:min-h-full gap-2">
        <ObjektDetail isOwned={isOwned} objekts={objekts} />
      </Modal.Body>
    </Modal.Content>
  );
}

type ObjektDetailProps = {
  isOwned?: boolean;
  objekts: ValidObjekt[];
};

function ObjektDetail({ objekts, isOwned = false }: ObjektDetailProps) {
  const [objekt] = objekts;
  const [flipped, setFlipped] = useState(false);

  const slug = getObjektSlug(objekt);
  const { data, status, refetch } = useQuery({
    queryKey: ["collection-metadata", "metadata", slug],
    queryFn: async ({ signal }) => {
      return await ofetch<ObjektMetadata>(`/api/objekts/metadata/${slug}`, {
        signal,
      });
    },
    retry: 1,
  });

  return (
    <>
      <div className="flex h-[21rem] sm:h-[28rem] aspect-photocard self-center flex-none">
        <Tilt tiltReverse transitionSpeed={3000} gyroscope>
          <div
            onClick={() => setFlipped((prev) => !prev)}
            data-flipped={flipped}
            className="relative h-full select-none aspect-photocard cursor-pointer touch-manipulation transition-transform transform-3d transform-gpu duration-300 data-[flipped=true]:rotate-y-180"
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
        </Tilt>
      </div>

      <div className="flex flex-col h-full sm:h-[28rem] overflow-y-auto">
        <div className="px-2 font-semibold">{getCollectionShortId(objekt)}</div>
        <AttributePanel objekt={objekt}>
          {status === "pending" && <Skeleton className="w-20 h-6" />}
          {status === "error" && (
            <Badge shape="square" intent="danger">
              Error
            </Badge>
          )}
          {status === "success" && (
            <Pill
              label={
                objekt.collectionNo?.toLowerCase()?.endsWith("z")
                  ? "Copies"
                  : "Scanned Copies"
              }
              value={data.total.toLocaleString()}
            />
          )}
        </AttributePanel>
        <Tabs
          aria-label="Objekt tab"
          defaultSelectedKey={isOwned ? "owned" : "metadata"}
          className="p-3"
        >
          <Tabs.List>
            {isOwned && <Tabs.Tab id="owned">Owned</Tabs.Tab>}
            <Tabs.Tab id="metadata">Description</Tabs.Tab>
            <Tabs.Tab id="trades">Trades</Tabs.Tab>
          </Tabs.List>
          {isOwned && (
            <Tabs.Panel id="owned">
              <OwnedListPanel objekts={objekts as OwnedObjekt[]} />
            </Tabs.Panel>
          )}
          <Tabs.Panel id="metadata">
            {status === "pending" && (
              <div className="space-y-2">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-56 h-4" />
              </div>
            )}
            {status === "error" && (
              <div className="flex flex-col justify-center gap-3 items-center">
                <IconBrokenChainLink className="size-12" />
                <p>Error loading metadata</p>
                <Button intent="secondary" onPress={() => refetch()}>
                  Retry
                </Button>
              </div>
            )}
            {status === "success" && <MetadataPanel metadata={data} />}
          </Tabs.Panel>
          <Tabs.Panel id="trades">
            <TradeView slug={slug} />
          </Tabs.Panel>
        </Tabs>
      </div>
    </>
  );
}

type AttributeProps = {
  objekt: ValidObjekt;
} & PropsWithChildren;

function AttributePanel({ objekt, children }: AttributeProps) {
  const artist = getObjektArtist(objekt);
  const onOffline = getObjektType(objekt);
  return (
    <div className="flex flex-wrap gap-2 p-2">
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
      {children}
    </div>
  );
}

type MetadataPanelProps = {
  metadata?: ObjektMetadata;
};

function MetadataPanel({ metadata }: MetadataPanelProps) {
  return <p>{metadata?.metadata?.description}</p>;
}

type OwnedListPanelProps = {
  objekts: OwnedObjekt[];
};

function OwnedListPanel({ objekts }: OwnedListPanelProps) {
  return (
    <GridList
      items={objekts}
      aria-label="Select objekt"
      selectionMode="single"
      className="min-w-64 max-h-full sm:max-h-[17.5rem]"
    >
      {(item) => (
        <GridList.Item textValue={`${item.objektNo}`} id={item.tokenId}>
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
    <Badge intent="secondary" className="" shape="square">
      <span className="font-semibold">{label}</span>
      <span>{value}</span>
    </Badge>
  );
}

function PillColor({ label, value, objekt }: PillProps) {
  return (
    <Badge
      shape="square"
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
  );
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
