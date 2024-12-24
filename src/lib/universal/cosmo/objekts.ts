export type OwnedObjektsResult = {
  hasNext: boolean;
  nextStartAfter?: number;
  // total: number;
  objekts: OwnedObjekt[];
};

export type ObjektBaseFields = {
  collectionId: string;
  season: string;
  member: string;
  collectionNo: string;
  class: string;
  artists: ("artms" | "tripleS")[];
  thumbnailImage: string;
  frontImage: string;
  backImage: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  comoAmount: number;
  transferablebyDefault: boolean;
  tokenId: string;
  tokenAddress: string;
  objektNo: number;
  transferable: boolean;
};

interface OwnedObjektCommonFields extends ObjektBaseFields {
  usedForGrid: boolean;
  lenticularPairTokenId: string | null;
  mintedAt: string;
  receivedAt: string;
}

export type NonTransferableReason =
  | "mint-pending"
  | "used-for-grid"
  | "challenge-reward"
  | "welcome-objekt"
  | "effect-objekt"
  | "bookmark-objekt"
  | "lenticular-objekt"
  | "not-transferable"; // indexer

interface OwnedObjektMinted extends OwnedObjektCommonFields {
  status: "minted";
  nonTransferableReason?: NonTransferableReason;
}

interface OwnedObjektPending extends OwnedObjektCommonFields {
  status: "pending";
  nonTransferableReason?: "mint-pending";
}

export type OwnedObjekt = OwnedObjektMinted | OwnedObjektPending;

export type ScannedObjekt = {
  objekt: ObjektBaseFields;
  isClaimed: boolean;
};
