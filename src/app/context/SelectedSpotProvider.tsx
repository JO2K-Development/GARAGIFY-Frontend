'use client';
import { createContext, useContext, useRef } from "react";
import * as fabric from "fabric";

const SelectedSpotContext = createContext<React.RefObject<fabric.Rect | null> | null>(null);

export const useSelectedSpot = () => {
  const context = useContext(SelectedSpotContext);
  if (!context) throw new Error("useSelectedSpot must be used within SelectedSpotProvider");
  return context;
};

export const SelectedSpotProvider = ({ children }: { children: React.ReactNode }) => {
  const selectedSpotRef = useRef<fabric.Rect | null>(null);
  return (
    <SelectedSpotContext.Provider value={selectedSpotRef}>
      {children}
    </SelectedSpotContext.Provider>
  );
};
