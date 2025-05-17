import * as fabric from "fabric";
import { v4 as uuidv4 } from "uuid";
import { FABRIC_META, FabricObjectTypes } from "@/components/Parking/constants";

const createLineWithAnchors = (
  canvas: fabric.Canvas,
  p1: fabric.Point,
  p2: fabric.Point,
  onMove?: () => void
) => {
  const id = uuidv4();

  const line = new fabric.Line([p1.x, p1.y, p2.x, p2.y], {
    stroke: "#666",
    strokeWidth: 2,
    selectable: false,
    evented: false,
  });

  line.set(FABRIC_META.customId, id);
  line.set(FABRIC_META.objectType, FabricObjectTypes.ParkingSpotGroup);
  canvas.add(line);

  const createAnchor = (x: number, y: number, index: 0 | 1) => {
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

    anchor.set("anchorIndex", index);
    anchor.set(FABRIC_META.groupId, id);
    anchor.set("isAnchor", true);

    anchor.on("moving", () => {
      const x = anchor.left!;
      const y = anchor.top!;

      if (index === 0) {
        line.set({ x1: anchor.left!, y1: anchor.top! });
      } else {
        line.set({ x2: anchor.left!, y2: anchor.top! });
      }

      if (onMove) onMove(); // ✅ Call callback here

      canvas.requestRenderAll();
    });

    canvas.add(anchor);
    return anchor;
  };

  createAnchor(p1.x, p1.y, 0);
  createAnchor(p2.x, p2.y, 1);
};

export default createLineWithAnchors;
