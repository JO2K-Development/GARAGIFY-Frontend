import * as fabric from "fabric";
import { ParkingMap } from "../Commons/types";

// Helper: hydrate by type
async function hydrateObject(obj: any, type: string): Promise<fabric.Object> {
  switch (type) {
    case "Rect":
      return await fabric.Rect.fromObject(obj);
    case "Circle":
      return await fabric.Circle.fromObject(obj);
    case "Polygon":
      return await fabric.Polygon.fromObject(obj);
    default:
      // fallback for unexpected types
      return new Promise((resolve) =>
        fabric.util.enlivenObjects([obj], ([hydrated]) => resolve(hydrated))
      );
  }
}

export async function hydrateParking(
  parkingData: ParkingMap
): Promise<ParkingMap> {
  // Hydrate all zones (assume Polygon, Rect, or whatever your zones are)
  const zones = await Promise.all(
    parkingData.zones.map(async (zone) => ({
      ...zone,
      fabricObject: await hydrateObject(
        zone.fabricObject,
        zone.fabricObject.type
      ),
    }))
  );
  // Hydrate all obstacles (assume Circle or similar)
  const obstacles = await Promise.all(
    parkingData.obstacles.map(async (obs) => ({
      ...obs,
      fabricObject: await hydrateObject(
        obs.fabricObject,
        obs.fabricObject.type
      ),
    }))
  );
  // Hydrate spot groups, but **only the spots**!
  const spotGroups = await Promise.all(
    parkingData.spotGroups.map(async (group) => ({
      ...group,
      spots: await Promise.all(
        group.spots.map(
          async (spot) => (await hydrateObject(spot, spot.type)) as fabric.Rect
        )
      ),
      // Optionally skip 'line' entirely or just keep as-is
      line: group.line, // ignored in rendering
    }))
  );
  return { zones, obstacles, spotGroups };
}
