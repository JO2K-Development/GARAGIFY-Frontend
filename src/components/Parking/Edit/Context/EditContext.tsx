"use client";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import * as fabric from "fabric";
import {
  CanvasObstacle,
  CanvasZone,
  Mode,
  ParkingMap,
  ParkingSpotGroup,
} from "../../Commons/utils/types";
import { EditContextType } from "./type";
import toSerializableParking from "../../Commons/serialization/toSerializableParking";
import { serializeMeta } from "../../Commons/serialization/metaHelpers";

if (!(fabric.Object.prototype as Record<string, any>)._metaPatchApplied) {
  const originalToObject = fabric.Object.prototype.toObject;
  fabric.Object.prototype.toObject = function (...args: any[]) {
    const obj = originalToObject.apply(this, args as any);
    Object.assign(obj, serializeMeta(this));
    return obj;
  };
  (fabric.Object.prototype as Record<string, any>)._metaPatchApplied = true;
}
export const EditContext = createContext<EditContextType | undefined>(
  undefined
);

export const EditProvider = ({ children }: PropsWithChildren) => {
  const [mode, setMode] = useState<Mode>(Mode.PARKING_SPOTS);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(
    null
  );

  const [parking, setParking] = useState<ParkingMap>({
    zones: [],
    obstacles: [],
    spotGroups: [],
  });
  useEffect(() => {
    setSelectedObject(null);
  }, [mode]);

  // Helper functions for mutating parking state
  const addZone = (zone: CanvasZone) =>
    setParking((prev) => ({ ...prev, zones: [...prev.zones, zone] }));

  const editZone = (id: string, updater: (zone: CanvasZone) => CanvasZone) =>
    setParking((prev) => ({
      ...prev,
      zones: prev.zones.map((z) => (z.id === id ? updater(z) : z)),
    }));

  const removeZone = (id: string) =>
    setParking((prev) => ({
      ...prev,
      zones: prev.zones.filter((z) => z.id !== id),
    }));

  const addObstacle = (obs: CanvasObstacle) =>
    setParking((prev) => ({ ...prev, obstacles: [...prev.obstacles, obs] }));

  const editObstacle = (
    id: string,
    updater: (obs: CanvasObstacle) => CanvasObstacle
  ) =>
    setParking((prev) => ({
      ...prev,
      obstacles: prev.obstacles.map((o) => (o.id === id ? updater(o) : o)),
    }));

  const removeObstacle = (id: string) =>
    setParking((prev) => ({
      ...prev,
      obstacles: prev.obstacles.filter((o) => o.id !== id),
    }));

  const addSpotGroup = (group: ParkingSpotGroup) =>
    setParking((prev) => ({
      ...prev,
      spotGroups: [...prev.spotGroups, group],
    }));

  const editSpotGroup = (
    id: string,
    updater: (group: ParkingSpotGroup) => ParkingSpotGroup
  ) =>
    setParking((prev) => ({
      ...prev,
      spotGroups: prev.spotGroups.map((g) => (g.id === id ? updater(g) : g)),
    }));

  const removeSpotGroup = (id: string) =>
    setParking((prev) => ({
      ...prev,
      spotGroups: prev.spotGroups.filter((g) => g.id !== id),
    }));

  return (
    <EditContext.Provider
      value={{
        mode,
        setMode,
        selectedObject,
        setSelectedObject,
        parking,
        setParking,

        addZone,
        editZone,
        removeZone,

        addObstacle,
        editObstacle,
        removeObstacle,

        addSpotGroup,
        editSpotGroup,
        removeSpotGroup,
      }}
    >
      <pre
        style={{
          background: "#222",
          color: "#0f0",
          padding: 12,
          margin: 12,
          borderRadius: 8,
          fontSize: 12,
          maxHeight: 300,
          overflow: "auto",
        }}
      >
        {JSON.stringify(toSerializableParking(parking), null, 2)}
      </pre>
      {children}
    </EditContext.Provider>
  );
};
