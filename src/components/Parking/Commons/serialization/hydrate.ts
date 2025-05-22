import { ParkingMap } from "../utils/types";
import { restoreMeta } from "./metaHelpers";
import * as fabric from "fabric";
async function hydrateObject(obj: fabric.Object): Promise<fabric.Object> {
  if (!obj || typeof obj !== "object" || !obj.type) {
    throw new Error("Invalid object for hydration");
  }
  let hydrated: fabric.Object;
  switch (obj.type) {
    case "Rect":
      hydrated = (await fabric.Rect.fromObject(obj)) as fabric.Object;
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
  restoreMeta(hydrated, obj);
  return hydrated;
}

export async function hydrateParking(
  parkingData: ParkingMap
): Promise<ParkingMap> {
  const zones = await Promise.all(
    parkingData.zones.map(async (zone) => ({
      ...zone,
      fabricObject: await hydrateObject(zone.fabricObject),
    }))
  );
  const obstacles = await Promise.all(
    parkingData.obstacles.map(async (obs) => ({
      ...obs,
      fabricObject: await hydrateObject(obs.fabricObject),
    }))
  );
  const spotGroups = await Promise.all(
    parkingData.spotGroups.map(async (group) => ({
      ...group,
      line: (await hydrateObject(group.line)) as fabric.Line,
      spots: (await Promise.all(
        group.spots.map(hydrateObject)
      )) as fabric.Rect[],
    }))
  );
  return { zones, obstacles, spotGroups };
}
