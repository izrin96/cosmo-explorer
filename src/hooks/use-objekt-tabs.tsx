"use client";

import { ReactNode, createContext, useContext, useState } from "react";

type ContextProps = {
  currentTab: string;
  setCurrentTab: (val: string) => void;
};

const ObjektTabsContext = createContext<ContextProps>({} as ContextProps);

type ProviderProps = {
  children: ReactNode;
  initialTab?: string;
};

export function ObjektTabsProvider({
  children,
  initialTab = "metadata",
}: ProviderProps) {
  const [currentTab, setCurrentTab] = useState(initialTab);
  return (
    <ObjektTabsContext value={{ currentTab, setCurrentTab }}>
      {children}
    </ObjektTabsContext>
  );
}

export function useObjektTabs() {
  const ctx = useContext(ObjektTabsContext);
  return {
    ...ctx,
  };
}
