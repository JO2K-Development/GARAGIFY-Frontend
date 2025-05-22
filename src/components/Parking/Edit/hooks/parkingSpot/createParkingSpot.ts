import {
  FabricMeta,
  FabricObjectTypes,
} from "@/components/Parking/Commons/utils/constants";
import { ParkingGroupMeta } from "@/components/Parking/Commons/utils/types";
import * as fabric from "fabric";
import { v4 as uuidv4 } from "uuid";

interface CreateParkingSpotProps {
  groupMeta: ParkingGroupMeta;
  left: number;
  top: number;
}

const createParkingSpot = ({
  groupMeta: { id, spotAngle, spotSize },
  left,
  top,
}: CreateParkingSpotProps) => {
  // Use soft background, rounded corners, and a subtle shadow
  const spotRect = new fabric.Rect({
    ...spotSize,
    angle: spotAngle,
    fill: "#f7f7fa", // very light gray, clean look
    stroke: "#1890ff", // blue, matches parking color schemes
    strokeWidth: 2.5,
    strokeUniform: true,
    rx: 8, // rounded corners
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
    left,
    top,
    shadow: new fabric.Shadow({
      color: "#cbe8ff",
      blur: 8,
      offsetX: 0,
      offsetY: 2,
    }),
    hoverCursor: "pointer",
  });

  const spotId = uuidv4();
  spotRect.set(FabricMeta.OBJECT_TYPE, FabricObjectTypes.PARKING_GROUP);
  spotRect.set(FabricMeta.GROUP_ID, id);
  spotRect.set(FabricMeta.SPOT_ID, spotId);

  return spotRect;
};

export default createParkingSpot;
