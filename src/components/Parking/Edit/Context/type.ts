import { Dispatch, SetStateAction } from "react";
import {
  ParkingMap,
  CanvasZone,
  CanvasObstacle,
  ParkingSpotGroup,
  Mode,
} from "../../Commons/types";
import * as fabric from "fabric";

export interface EditContextType {
  mode: Mode;
  setMode: (mode: Mode) => void;

  selectedObject: fabric.Object | null;
  setSelectedObject: (obj: fabric.Object | null) => void;

  parking: ParkingMap;
  setParking: Dispatch<SetStateAction<ParkingMap>>;

  // helpers for convenience (optional)
  addZone: (zone: CanvasZone) => void;
  editZone: (id: string, updater: (zone: CanvasZone) => CanvasZone) => void;
  removeZone: (id: string) => void;

  addObstacle: (obs: CanvasObstacle) => void;
  editObstacle: (
    id: string,
    updater: (obs: CanvasObstacle) => CanvasObstacle
  ) => void;
  removeObstacle: (id: string) => void;

  addSpotGroup: (group: ParkingSpotGroup) => void;
  editSpotGroup: (
    id: string,
    updater: (group: ParkingSpotGroup) => ParkingSpotGroup
  ) => void;
  removeSpotGroup: (id: string) => void;
}
