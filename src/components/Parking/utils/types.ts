import Konva from "konva";

export interface ParkingSpot extends Point {
  id: string;
  rotation: number;
  status: string;
}

export interface ParkingLine extends ParkingLineSpotConfig, AttachedPoints {
  id: string;
  spots: ParkingSpot[];
  spotsCount: number;
}

export interface AttachedPoints {
  start: Point;
  end: Point;
}
export interface ParkingLineSpotConfig {
  width: number;
  height: number;
  rotation: number;
}

export interface Point {
  x: number;
  y: number;
}

export type CircleAnchor = "start" | "end";

export type HandlerType = (
  e: Konva.KonvaEventObject<MouseEvent>
) => boolean | void;
