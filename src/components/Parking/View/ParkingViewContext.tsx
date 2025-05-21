"use client";
import React, { createContext, useContext } from "react";
import { ParkingMap } from "../Commons/types";

interface ParkingViewContextType {
  parking: ParkingMap;
}

const ParkingViewContext = createContext<ParkingViewContextType | undefined>(
  undefined
);

export const useParkingViewContext = () => {
  const ctx = useContext(ParkingViewContext);

  return ctx ?? { parking: undefined };
};

interface ParkingViewProviderProps {
  parking: ParkingMap; // Pass in from parent or page
  children: React.ReactNode;
}

export const ParkingViewProvider: React.FC<ParkingViewProviderProps> = ({
  parking,
  children,
}) => (
  <ParkingViewContext.Provider value={{ parking }}>
    {children}
  </ParkingViewContext.Provider>
);
