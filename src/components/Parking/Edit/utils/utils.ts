import * as fabric from "fabric";
import { ParkingSpotGroup } from "../../Commons/types";

export const redrawParkingSpotGroup = (
  canvas: fabric.Canvas,
  group: ParkingSpotGroup
) => {
  // Remove all objects with the same groupId
  canvas.getObjects().forEach((obj) => {
    if (obj.get("groupId") === group.id) canvas.remove(obj);
  });

  const { spotCount, spotSize, spotAngle } = group;
  const { x1, y1, x2, y2 } = group.line;

  const p1 = new fabric.Point(x1!, y1!);
  const p2 = new fabric.Point(x2!, y2!);

  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const spacing = spotSize.width + 5;
  const totalWidth = spotCount * spacing;

  // Calculate start and end points to evenly distribute spots along the line
  const lineAngle = Math.atan2(dy, dx);

  // Center of the line
  const center = new fabric.Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);

  // Create unit vectors
  const unitX = dx / length;
  const unitY = dy / length;

  // Calculate the offset from center to start
  const offsetStart = -((totalWidth - spacing) / 2);

  // Create spots
  const spots: fabric.Rect[] = [];

  for (let i = 0; i < spotCount; i++) {
    const offset = offsetStart + i * spacing;
    const cx = center.x + offset * unitX;
    const cy = center.y + offset * unitY;

    const spot = new fabric.Rect({
      width: spotSize.width,
      height: spotSize.height,
      fill: "gray",
      left: cx,
      top: cy,
      angle: spotAngle,
      originX: "center",
      originY: "center",
      selectable: true,
      hasControls: false,
      hasBorders: true,
      lockMovementX: true,
      lockMovementY: true,
      hoverCursor: "pointer",
      strokeWidth: 1,
      stroke: "#666",
    });

    spot.set("groupId", group.id);
    spot.set("objectType", "parkingSpot");
    canvas.add(spot);
    spots.push(spot);
  }

  // Create the line
  const newLine = new fabric.Line([p1.x, p1.y, p2.x, p2.y], {
    stroke: "black",
    strokeWidth: 2,
    hasControls: false,
    hasBorders: false,
    lockScalingX: true,
    lockScalingY: true,
    lockRotation: true,
    selectable: true,
    hoverCursor: "move",
  });

  newLine.set("customId", group.id);
  newLine.set("groupId", group.id);
  newLine.set("objectType", "parkingLine");
  canvas.add(newLine);

  // Create anchor points at the ends of the line
  const startAnchor = new fabric.Circle({
    left: p1.x,
    top: p1.y,
    radius: 6,
    fill: "#0078d4",
    originX: "center",
    originY: "center",
    hasControls: false,
    hasBorders: false,
    selectable: true,
    hoverCursor: "pointer",
  });

  startAnchor.set("anchorType", "start");
  startAnchor.set("groupId", group.id);

  const endAnchor = new fabric.Circle({
    left: p2.x,
    top: p2.y,
    radius: 6,
    fill: "#0078d4",
    originX: "center",
    originY: "center",
    hasControls: false,
    hasBorders: false,
    selectable: true,
    hoverCursor: "pointer",
  });

  endAnchor.set("anchorType", "end");
  endAnchor.set("groupId", group.id);

  canvas.add(startAnchor);
  canvas.add(endAnchor);

  group.spots = spots;
  group.line = newLine;
  group.line.set({
    x1: p1.x,
    y1: p1.y,
    x2: p2.x,
    y2: p2.y,
  });

  // Ensure proper z-index
  spots.forEach((spot) => canvas.bringObjectToFront(spot));
  canvas.bringObjectToFront(startAnchor);
  canvas.bringObjectToFront(endAnchor);

  canvas.requestRenderAll();
};
