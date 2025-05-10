export interface Spot {
  id: string;
  x: number;
  y: number;
  rotation: number;
  status: string;
}

export interface ParkingLine {
  id: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  spots: Spot[];
  spotsCount: number;
  spotWidth: number;
  spotHeight: number;
  spotAngle: number;
}
