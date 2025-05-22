import * as fabric from "fabric";
import { v4 as uuidv4 } from "uuid";
import {
  FabricMeta,
  FabricObjectTypes,
} from "@/components/Parking/Commons/utils/constants";

// Optionally pass zIndex (number) as a parameter
const createParkingZone = (points: fabric.Point[]) => {
  const id = uuidv4();

  // Convert points to plain objects if needed (for Fabric.js < 5)
  const polygonPoints = points.map((p) => ({ x: p.x, y: p.y }));

  const polygon = new fabric.Polygon(polygonPoints, {
    fill: "rgba(30, 144, 255, 0.18)", // softer, more modern blue
    stroke: "#2196f3", // bolder blue outline
    strokeWidth: 3,
    strokeDashArray: [8, 4], // dashed border for clarity
    selectable: true,
    objectCaching: false,
    shadow: new fabric.Shadow({
      color: "#90caf9",
      blur: 14,
      offsetX: 0,
      offsetY: 2,
    }),
    cornerColor: "#2196f3", // custom corner color when selected
    borderColor: "#1565c0", // border when selected
    transparentCorners: false, // solid selection corners
    cornerSize: 10, // easier to grab
    hoverCursor: "pointer",
  });

  polygon.set(FabricMeta.OBJECT_ID, id);
  polygon.set(FabricMeta.OBJECT_TYPE, FabricObjectTypes.PARKING_ZONE);

  return { id, fabricObject: polygon };
};

export default createParkingZone;
