"use client";
import { createContext, PropsWithChildren, useContext, useState } from "react";

interface SelectedSpotContextType {
  selectedSpotId: string | null;
  setSelectedSpotId: (id: string | null) => void;
  disabledSpotIds: string[];
  setDisabledSpotIds: (ids: string[]) => void;
  allSpotIds: string[];
  setAllSpotIds: (ids: string[]) => void;
}

const SpotContext = createContext<SelectedSpotContextType>({
  selectedSpotId: null,
  setSelectedSpotId: () => {},
  disabledSpotIds: [],
  setDisabledSpotIds: () => {},
  allSpotIds: [],
  setAllSpotIds: () => {},
});

export const useSpot = () => {
  const context = useContext(SpotContext);
  if (!context)
    throw new Error("useSpot must be used within SpotProvider");
  return context;
};

export const SpotProvider = ({ children }: PropsWithChildren) => {
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [disabledSpotIds, setDisabledSpotIds] = useState<string[]>([]);
  const [allSpotIds, setAllSpotIds] = useState<string[]>([]);

  return (
    <SpotContext.Provider
      value={{
        selectedSpotId,
        setSelectedSpotId,
        disabledSpotIds,
        setDisabledSpotIds,
        allSpotIds,
        setAllSpotIds,
      }}
    >
      {children}
    </SpotContext.Provider>
  );
};
