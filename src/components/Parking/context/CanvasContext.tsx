"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import * as fabric from "fabric";

export type Mode = "parkingZone" | "obstacles" | "parkingSpots" | "view";

interface CanvasObstacle {
  id: string;
  type: "tree" | "area";
  fabricObject: fabric.Object;
}

export interface CanvasZone {
  id: string;
  name?: string;
  fabricObject: fabric.Object;
}
interface CanvasContextType {
  mode: Mode;
  setMode: (mode: Mode) => void;

  selectedObject: fabric.Object | null;
  setSelectedObject: (obj: fabric.Object | null) => void;

  parkingZones: CanvasZone[];
  addParkingZone: (zone: CanvasZone) => void;
  editParkingZone: (
    id: string,
    updater: (zone: CanvasZone) => CanvasZone
  ) => void;
  removeParkingZone: (id: string) => void;

  obstacles: CanvasObstacle[];
  addObstacle: (obs: CanvasObstacle) => void;
  editObstacle: (
    id: string,
    updater: (obj: CanvasObstacle) => CanvasObstacle
  ) => void;
  removeObstacle: (id: string) => void;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<Mode>("parkingZone");

  useEffect(() => {
    if (selectedObject) {
      setSelectedObject(null);
    }
    // Clear selection on canvas too
    const active = selectedObject?.canvas;
    if (active && active.getActiveObject()) {
      active.discardActiveObject();
      active.requestRenderAll();
    }
  }, [mode]);

  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(
    null
  );

  const [parkingZones, setParkingZones] = useState<CanvasZone[]>([]);
  const addParkingZone = (zone: CanvasZone) =>
    setParkingZones((prev) => [...prev, zone]);
  const editParkingZone = (
    id: string,
    updater: (zone: CanvasZone) => CanvasZone
  ) =>
    setParkingZones((prev) => prev.map((z) => (z.id === id ? updater(z) : z)));
  const removeParkingZone = (id: string) =>
    setParkingZones((prev) => prev.filter((z) => z.id !== id));

  const [obstacles, setObstacles] = useState<CanvasObstacle[]>([]);

  const addObstacle = (obs: CanvasObstacle) =>
    setObstacles((prev) => [...prev, obs]);

  const editObstacle = (
    id: string,
    updater: (obj: CanvasObstacle) => CanvasObstacle
  ) => setObstacles((prev) => prev.map((o) => (o.id === id ? updater(o) : o)));
  const removeObstacle = (id: string) =>
    setObstacles((prev) => prev.filter((o) => o.id !== id));
  console.log(obstacles);
  console.log(parkingZones);
  return (
    <CanvasContext.Provider
      value={{
        mode,
        setMode,
        selectedObject,
        setSelectedObject,
        parkingZones,
        addParkingZone,
        removeParkingZone,
        addObstacle,
        editObstacle,
        obstacles,
        editParkingZone,
        removeObstacle,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvasContext = () => {
  const ctx = useContext(CanvasContext);
  if (!ctx)
    throw new Error("useCanvasContext must be used inside CanvasProvider");
  return ctx;
};
