import { CircleAnchor, Point } from "@/components/Parking/utils/types";

export type HandleCircleDrag = (
  lineId: string,
  point: CircleAnchor,
  pos: Point
) => void;
