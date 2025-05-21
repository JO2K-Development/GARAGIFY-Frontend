import * as fabric from "fabric";
import {
  ParkingMap,
  CanvasZone,
  CanvasObstacle,
  ParkingSpotGroup,
} from "../../Commons/types";
import { FABRIC_META } from "../../Commons/constants";
function restoreMeta(obj: fabric.Object, plain: any) {
  // Add all your custom meta properties here
  if (plain[FABRIC_META.parkingSpotId])
    obj.set(FABRIC_META.parkingSpotId, plain[FABRIC_META.parkingSpotId]);
  if (plain[FABRIC_META.groupId])
    obj.set(FABRIC_META.groupId, plain[FABRIC_META.groupId]);
  if (plain[FABRIC_META.objectType])
    obj.set(FABRIC_META.objectType, plain[FABRIC_META.objectType]);
  if (plain[FABRIC_META.customId])
    obj.set(FABRIC_META.customId, plain[FABRIC_META.customId]);
  // Add any other meta keys as needed
}

async function hydrateObject(obj: any): Promise<fabric.Object> {
  if (!obj || typeof obj !== "object" || !obj.type) {
    throw new Error("Invalid object for hydration");
  }
  let hydrated: fabric.Object;
  switch (obj.type) {
    case "Rect":
      hydrated = (await fabric.Rect.fromObject(obj)) as fabric.Rect;
      break;
    case "Circle":
      hydrated = await fabric.Circle.fromObject(obj);
      break;
    case "Polygon":
      hydrated = await fabric.Polygon.fromObject(obj);
      break;
    case "Line":
      hydrated = await fabric.Line.fromObject(obj);
      break;
    default:
      [hydrated] = await fabric.util.enlivenObjects([obj]);
  }
  restoreMeta(hydrated, obj); // <--- add this
  return hydrated;
}

export async function hydrateParking(
  parkingData: ParkingMap
): Promise<ParkingMap> {
  const zones: CanvasZone[] = await Promise.all(
    parkingData.zones.map(async (zone) => ({
      ...zone,
      fabricObject: (await hydrateObject(zone.fabricObject)) as fabric.Object,
    }))
  );

  const obstacles: CanvasObstacle[] = await Promise.all(
    parkingData.obstacles.map(async (obs) => ({
      ...obs,
      fabricObject: (await hydrateObject(obs.fabricObject)) as fabric.Object,
    }))
  );

  const spotGroups: ParkingSpotGroup[] = await Promise.all(
    parkingData.spotGroups.map(async (group) => ({
      ...group,
      line: (await hydrateObject(group.line)) as fabric.Line,
      spots: await Promise.all(
        group.spots.map(
          async (spot) => (await hydrateObject(spot)) as fabric.Rect
        )
      ),
    }))
  );

  return { zones, obstacles, spotGroups };
}
