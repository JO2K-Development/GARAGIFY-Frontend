import createLineWithAnchors from "./createLineWithAnchors";
import * as fabric from "fabric";
import { v4 as uuidv4 } from "uuid";
import { generateSpotsOnLine, regenerateSpots } from "./spotsGeneration";
import { ParkingSpotGroup } from "@/components/Parking/Commons/types";

interface CreateSpotGroupProps {
  canvas?: fabric.Canvas | null;
  editParkingSpotGroup: (
    id: string,
    updater: (prev: ParkingSpotGroup) => ParkingSpotGroup
  ) => void;
  addParkingSpotGroup: (group: ParkingSpotGroup) => void;
  p1: fabric.Point;
  p2: fabric.Point;
}
const createSpotGroup = ({
  canvas,
  addParkingSpotGroup,
  editParkingSpotGroup,
  p1,
  p2,
}: CreateSpotGroupProps) => {
  const id = uuidv4();
  const {
    line,
    anchors: [anchor1, anchor2],
  } = createLineWithAnchors(p1, p2, id);
  canvas?.add(line);
  canvas?.add(anchor1);
  canvas?.add(anchor2);

  anchor1.on("moving", () => {
    const x = anchor1.left!;
    const y = anchor1.top!;

    line.set({ x1: x, y1: y });

    editParkingSpotGroup(id, (prev) => {
      const updated = { ...prev, line };
      regenerateSpots(updated, canvas);
      return updated;
    });
  });

  anchor2.on("moving", () => {
    const x = anchor2.left!;
    const y = anchor2.top!;

    line.set({ x2: x, y2: y });

    editParkingSpotGroup(id, (prev) => {
      const updated = { ...prev, line };
      regenerateSpots(updated, canvas);
      return updated;
    });
  });

  const group: ParkingSpotGroup = {
    id,
    line,
    spots: [],
    spotCount: 1,
    spotSize: { width: 40, height: 60 },
    spotAngle: 0,
  };

  const spots = generateSpotsOnLine(group);
  spots.forEach((s) => canvas?.add(s));
  group.spots = spots;

  addParkingSpotGroup(group);
};

export default createSpotGroup;
