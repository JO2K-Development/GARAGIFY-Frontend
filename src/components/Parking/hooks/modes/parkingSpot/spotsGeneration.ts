import { FABRIC_META, FabricObjectTypes } from "@/components/Parking/constants";
import { ParkingSpotGroup } from "@/components/Parking/context/CanvasContext";
import * as fabric from "fabric";
import createParkingSpot from "./createParkingSpot";

export const generateSpotsOnLine = (group: ParkingSpotGroup): fabric.Rect[] => {
  const { x1, y1, x2, y2 } = group.line;
  const dx = (x2! - x1!) / (group.spotCount + 1);
  const dy = (y2! - y1!) / (group.spotCount + 1);
  const spots: fabric.Rect[] = [];

  for (let i = 1; i <= group.spotCount; i++) {
    const left = x1! + dx * i;
    const top = y1! + dy * i;
    const obj = createParkingSpot({
      groupMeta: group,
      left,
      top,
    });

    spots.push(obj);
  }

  return spots;
};

export const regenerateSpots = (
  group: ParkingSpotGroup,
  canvas?: fabric.Canvas | null
) => {
  if (!canvas) return;
  const existingSpots = canvas
    ?.getObjects()
    .filter(
      (obj) =>
        obj.get(FABRIC_META.groupId) === group.id &&
        obj.get(FABRIC_META.objectType) ===
          FabricObjectTypes.ParkingSpotGroup &&
        obj instanceof fabric.Rect
    ) as fabric.Rect[];

  existingSpots.forEach((spot) => canvas?.remove(spot));

  const newSpots = generateSpotsOnLine(group);
  newSpots.forEach((s) => canvas?.add(s));
  group.spots = newSpots;
  canvas?.requestRenderAll();
};
