import * as fabric from "fabric";
import { v4 as uuidv4 } from "uuid";
import {
  FabricMeta,
  FabricObjectTypes,
} from "@/components/Parking/Commons/constants";

const createParkingZone = (points: fabric.Point[]) => {
  const id = uuidv4();

  const polygon = new fabric.Polygon([...points], {
    fill: "rgba(0, 128, 255, 0.3)",
    stroke: "#0078d4",
    strokeWidth: 2,
    selectable: true,
    objectCaching: false,
  });

  polygon.set(FabricMeta.OBJECT_ID, id);
  polygon.set(FabricMeta.OBJECT_TYPE, FabricObjectTypes.PARKING_ZONE);

  return { id, fabricObject: polygon };
};

export default createParkingZone;
