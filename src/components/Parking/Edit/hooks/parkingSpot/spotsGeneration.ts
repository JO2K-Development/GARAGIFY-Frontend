import {
  FabricMeta,
  FabricObjectTypes,
} from "@/components/Parking/Commons/utils/constants";
import * as fabric from "fabric";
import { ParkingSpotGroup } from "@/components/Parking/Commons/utils/types";
import createParkingSpot from "./createParkingSpot";
import WithCanvas from "@/components/Parking/Commons/utils/WithCanvas";

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

interface RegenerateSpotsProps {
  group: ParkingSpotGroup;
}
export const regenerateSpots = ({
  group,
  canvas,
}: WithCanvas<RegenerateSpotsProps>) => {
  if (!canvas) return;
  const existingSpots = canvas
    ?.getObjects()
    .filter(
      (obj) =>
        obj.get(FabricMeta.GROUP_ID) === group.id &&
        obj.get(FabricMeta.OBJECT_TYPE) === FabricObjectTypes.PARKING_GROUP &&
        obj instanceof fabric.Rect
    ) as fabric.Rect[];

  existingSpots.forEach((spot) => canvas?.remove(spot));

  const newSpots = generateSpotsOnLine(group);
  newSpots.forEach((s) => canvas?.add(s));
  group.spots = newSpots;
  canvas?.requestRenderAll();
};
