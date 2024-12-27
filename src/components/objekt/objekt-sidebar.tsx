import { useElementSize } from "@/hooks/use-element-size";
import React from "react";

type Props = {
  collection: string;
  serial?: number;
};

export default function ObjektSidebar({ collection, serial }: Props) {
  const [ref, { width }] = useElementSize();
  return (
    <div
      ref={ref}
      className="absolute h-full items-center w-[11%] flex gap-2 justify-center top-0 right-0 [writing-mode:vertical-lr] font-semibold text-[var(--objekt-text-color)] select-none"
      style={{ lineHeight: `${width}px`, fontSize: `${width * 0.47}px` }}
    >
      <span>{collection}</span>
      {serial && <span className="font-dotmatrix font-normal mr-[3px]">#{serial.toString().padStart(5, "0")}</span>}
    </div>
  );
}
