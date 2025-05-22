import {
  FabricMeta,
  FabricObjectTypes,
} from "@/components/Parking/Commons/constants";
import { ParkingGroupMeta } from "@/components/Parking/Commons/types";
import * as fabric from "fabric";
import { v4 as uuidv4 } from "uuid";
interface CreateParkingSpotProps {
  groupMeta: ParkingGroupMeta;
  left: number;
  top: number;
}

const createParkingSpot = ({
  groupMeta: { id, spotAngle, spotSize },
  ...rest
}: CreateParkingSpotProps) => {
  const obj = new fabric.Rect({
    ...spotSize,
    angle: spotAngle,
    fill: "#bbb",
    stroke: "#444",
    strokeWidth: 1,
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
    ...rest,
  });

  const spotId = uuidv4();
  obj.set(FabricMeta.OBJECT_TYPE, FabricObjectTypes.PARKING_GROUP);
  obj.set(FabricMeta.SPOT_ID, spotId);
  obj.set(FabricMeta.GROUP_ID, id);

  return obj;
};

export default createParkingSpot;
