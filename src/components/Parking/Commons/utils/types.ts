import * as fabric from "fabric";



export enum Mode {
  PARKING_ZONE = "parkingZone",
  OBSTACLES = "obstacles",
  PARKING_SPOTS = "parkingSpots",
  VIEW = "view",
}

export enum ObstacleType {
  TREE = "tree",
  AREA = "area",
}

export interface ParkingGroupMeta {
  id: string;
  spotCount: number;
  spotSize: { width: number; height: number };
  spotAngle: number;
}

export interface ParkingSpotGroup extends ParkingGroupMeta {
  line: fabric.Line;
  spots: fabric.Rect[];
}

export interface CanvasObstacle {
  id: string;
  type: ObstacleType;
  fabricObject: fabric.Object;
}

export interface CanvasZone {
  id: string;
  name?: string;
  fabricObject: fabric.Object;
}

export interface ParkingMap {
  zones: CanvasZone[];
  obstacles: CanvasObstacle[];
  spotGroups: ParkingSpotGroup[];
}
