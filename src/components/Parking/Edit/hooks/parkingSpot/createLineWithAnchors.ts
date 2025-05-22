import * as fabric from "fabric";
import {
  FabricMeta,
  FabricObjectTypes,
} from "@/components/Parking/Commons/utils/constants";

// Nicer anchor
const createAnchor = (x: number, y: number, id: string) => {
  const anchor = new fabric.Circle({
    left: x,
    top: y,
    radius: 9, // Bigger for easier interaction
    fill: "#1976d2", // Modern blue
    stroke: "#fff", // White outline
    strokeWidth: 2.5,
    originX: "center",
    originY: "center",
    hasControls: false,
    hasBorders: false,
    selectable: true,
    evented: true,
    shadow: new fabric.Shadow({
      color: "#a2c8f7",
      blur: 7,
      offsetX: 0,
      offsetY: 2,
    }),
    hoverCursor: "pointer",
  });
  anchor.set(FabricMeta.OBJECT_TYPE, FabricObjectTypes.ANCHOR);
  anchor.set(FabricMeta.GROUP_ID, id);
  return anchor;
};

const createLineWithAnchors = (
  p1: fabric.Point,
  p2: fabric.Point,
  id: string
) => {
  const line = new fabric.Line([p1.x, p1.y, p2.x, p2.y], {
    stroke: "#1976d2", // Matches anchor, modern blue
    strokeWidth: 4,
    strokeLineCap: "round", // Rounded ends
    selectable: false,
    hasControls: false,
    evented: false,
    shadow: new fabric.Shadow({
      color: "#a2c8f7",
      blur: 8,
      offsetX: 0,
      offsetY: 2,
    }),
  });
  line.set(FabricMeta.OBJECT_ID, id);
  line.set(FabricMeta.OBJECT_TYPE, FabricObjectTypes.PARKING_GROUP);
  line.set(FabricMeta.GROUP_ID, id);

  return {
    line,
    anchors: [createAnchor(p1.x, p1.y, id), createAnchor(p2.x, p2.y, id)],
  };
};

export default createLineWithAnchors;
