import { FABRIC_META, FabricObjectTypes } from "@/components/Parking/constants";
import { ObstacleType } from "@/components/Parking/context/CanvasContext";
import * as fabric from "fabric";
import { v4 as uuidv4 } from "uuid";

const createObstacle = (currentType: ObstacleType, point: fabric.Point) => {
  const id = uuidv4();
  const { x, y } = point;
  let obj: fabric.Object;

  switch (currentType) {
    case ObstacleType.TREE:
      obj = new fabric.Circle({
        radius: 45,
        fill: "green",
        left: x,
        top: y,
        selectable: true,
      });
      break;
    case ObstacleType.AREA:
      obj = new fabric.Rect({
        width: 100,
        height: 200,
        fill: "rgba(0, 0, 255, 0.3)",
        stroke: "#0078d4",
        strokeWidth: 1,
        left: x,
        top: y,
        selectable: true,
      });
      break;
    default:
      throw new Error(`Unsupported obstacle type: ${currentType}`);
  }

  obj.set(FABRIC_META.customId, id);
  obj.set(FABRIC_META.objectType, FabricObjectTypes.Obstacle);
  return obj;
};

export default createObstacle;
