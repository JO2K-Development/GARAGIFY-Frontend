import * as fabric from "fabric";
import {
  FabricMeta,
  FabricObjectTypes,
} from "@/components/Parking/Commons/constants";

const createAnchor = (x: number, y: number, id: string) => {
  const anchor = new fabric.Circle({
    left: x,
    top: y,
    radius: 6,
    fill: "blue",
    stroke: "#000",
    originX: "center",
    originY: "center",
    hasControls: false,
    hasBorders: false,
    selectable: true,
    evented: true,
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
    stroke: "#666",
    strokeWidth: 2,
    selectable: false,
    hasControls: false,
    evented: false,
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
