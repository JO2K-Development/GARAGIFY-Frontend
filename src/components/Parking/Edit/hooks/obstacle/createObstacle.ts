import {
  FabricMeta,
  FabricObjectTypes,
} from "@/components/Parking/Commons/utils/constants";
import { ObstacleType } from "@/components/Parking/Commons/utils/types";
import * as fabric from "fabric";
import { v4 as uuidv4 } from "uuid";

const createObstacle = (currentType: ObstacleType, point: fabric.Point) => {
  const id = uuidv4();
  const { x, y } = point;
  let obj: fabric.Object;

  switch (currentType) {
    case ObstacleType.TREE: {
      obj = new fabric.Circle({
        radius: 32,
        fill: new fabric.Gradient({
          type: "radial",
          coords: { x1: 0.5, y1: 0.5, r1: 5, x2: 0.5, y2: 0.5, r2: 32 },
          colorStops: [
            { offset: 0, color: "#a6e674" },
            { offset: 1, color: "#399f38" },
          ],
        }),
        left: x - 32,
        top: y - 32,
        selectable: true,
        shadow: new fabric.Shadow({
          color: "#399f38",
          blur: 12,
          offsetX: 0,
          offsetY: 4,
        }),
        hasBorders: true,
        hasControls: true,
        hoverCursor: "pointer",
      });
      break;
    }

    case ObstacleType.AREA: {
      // Area parameters
      const rectWidth = 100;
      const rectHeight = 160;
      const rx = 18;

      // Rectangle (no-parking area)
      const areaRect = new fabric.Rect({
        width: rectWidth,
        height: rectHeight,
        rx,
        fill: "rgba(255, 255, 255, 0.12)",
        stroke: "#ff3b47",
        strokeWidth: 3,
        strokeUniform: true,
        left: 0,
        top: 0,
        selectable: false,
        shadow: new fabric.Shadow({
          color: "#ffbdbd",
          blur: 10,
          offsetX: 0,
          offsetY: 2,
        }),
      });

      const inset = rx;

      const crossLine1 = new fabric.Line(
        [inset, inset, rectWidth - inset, rectHeight - inset],
        {
          stroke: "#ff3b47",
          strokeWidth: 5,
          strokeUniform: true,
          selectable: false,
        }
      );
      const crossLine2 = new fabric.Line(
        [rectWidth - inset, inset, inset, rectHeight - inset],
        {
          stroke: "#ff3b47",
          strokeWidth: 5,
          strokeUniform: true,
          selectable: false,
        }
      );

      obj = new fabric.Group([areaRect, crossLine1, crossLine2], {
        left: x,
        top: y,
        selectable: true,
        hasBorders: true,
        hasControls: true,
        objectCaching: true,
        hoverCursor: "pointer",
      });

      break;
    }

    default:
      throw new Error(`Unsupported obstacle type: ${currentType}`);
  }

  obj.set(FabricMeta.OBJECT_ID, id);
  obj.set(FabricMeta.OBJECT_TYPE, FabricObjectTypes.OBSTACLE);
  return obj;
};

export default createObstacle;
