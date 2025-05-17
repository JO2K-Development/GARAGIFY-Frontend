"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import * as fabric from "fabric";

export enum Mode {
  PARKING_ZONE = "parkingZone",
  OBSTACLES = "obstacles",
  PARKING_SPOTS = "parkingSpots",
  VIEW = "view",
}

export interface ParkingSpotGroup {
  id: string;
  line: fabric.Line;
  spots: fabric.Rect[];
  spotCount: number;
  spotSize: { width: number; height: number };
  spotAngle: number;
}

export enum ObstacleType {
  TREE = "tree",
  AREA = "area",
}
interface CanvasObstacle {
  id: string;
  type: ObstacleType;
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

  parkingSpotGroups: ParkingSpotGroup[];
  addParkingSpotGroup: (group: ParkingSpotGroup) => void;
  editParkingSpotGroup: (
    id: string,
    updater: (group: ParkingSpotGroup) => ParkingSpotGroup
  ) => void;
  removeParkingSpotGroup: (id: string) => void;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<Mode>(Mode.PARKING_ZONE);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(
    null
  );

  const [parkingZones, setParkingZones] = useState<CanvasZone[]>([]);
  const [obstacles, setObstacles] = useState<CanvasObstacle[]>([]);
  const [parkingSpotGroups, setParkingSpotGroups] = useState<
    ParkingSpotGroup[]
  >([]);

  // 🧼 Reset selection when switching modes
  useEffect(() => {
    setSelectedObject(null);
  }, [mode]);

  return (
    <CanvasContext.Provider
      value={{
        mode,
        setMode,
        selectedObject,
        setSelectedObject,

        parkingZones,
        addParkingZone: (zone) => setParkingZones((prev) => [...prev, zone]),
        editParkingZone: (id, updater) =>
          setParkingZones((prev) =>
            prev.map((z) => (z.id === id ? updater(z) : z))
          ),
        removeParkingZone: (id) =>
          setParkingZones((prev) => prev.filter((z) => z.id !== id)),

        obstacles,
        addObstacle: (obs) => setObstacles((prev) => [...prev, obs]),
        editObstacle: (id, updater) =>
          setObstacles((prev) =>
            prev.map((o) => (o.id === id ? updater(o) : o))
          ),
        removeObstacle: (id) =>
          setObstacles((prev) => prev.filter((o) => o.id !== id)),

        parkingSpotGroups,
        addParkingSpotGroup: (group) =>
          setParkingSpotGroups((prev) => [...prev, group]),
        editParkingSpotGroup: (id, updater) =>
          setParkingSpotGroups((prev) =>
            prev.map((g) => (g.id === id ? updater(g) : g))
          ),
        removeParkingSpotGroup: (id) =>
          setParkingSpotGroups((prev) => prev.filter((g) => g.id !== id)),
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
