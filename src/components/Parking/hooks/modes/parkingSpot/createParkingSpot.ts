import { ParkingGroupMeta } from "@/components/Parking/context/CanvasContext";
import { FABRIC_META, FabricObjectTypes } from "@/components/Parking/constants";
import * as fabric from "fabric";
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

  obj.set(FABRIC_META.objectType, FabricObjectTypes.ParkingSpotGroup);
  obj.set(FABRIC_META.groupId, id);

  
  return obj;
};

export default createParkingSpot;
