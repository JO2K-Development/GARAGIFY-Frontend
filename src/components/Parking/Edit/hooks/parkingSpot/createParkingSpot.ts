import {
  FABRIC_META,
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
  obj.set(FABRIC_META.objectType, FabricObjectTypes.ParkingSpotGroup);
  obj.set(FABRIC_META.parkingSpotId, spotId);
  obj.set(FABRIC_META.groupId, id);

  return obj;
};

export default createParkingSpot;
