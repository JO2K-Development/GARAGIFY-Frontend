import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { v4 as uuidv4 } from "uuid";
import {
  ParkingSpotGroup,
  useCanvasContext,
} from "../../../context/CanvasContext";
import { FABRIC_META, FabricObjectTypes } from "../../../constants";

const useParkingSpotsMode = (canvas: fabric.Canvas | null) => {
  const { mode, setSelectedObject, addParkingSpotGroup, editParkingSpotGroup } =
    useCanvasContext();
  const isActive = mode === "parkingSpots";

  const placingRef = useRef(false);
  const clickRef = useRef<fabric.Point[]>([]);
  const anchorRefs = useRef<Record<string, fabric.Circle[]>>({});

  // PUBLIC API (call this from UI)
  const startPlacing = () => {
    placingRef.current = true;
    clickRef.current = [];
  };

  function addAnchorsToLine(group: ParkingSpotGroup, canvas: fabric.Canvas) {
    const handleAnchorMove = (anchor: fabric.Circle, index: 0 | 1) => {
      const [a1, a2] = anchorRefs.current[group.id];
      const [x1, y1] =
        index === 0 ? [anchor.left!, anchor.top!] : [a1.left!, a1.top!];
      const [x2, y2] =
        index === 0 ? [a2.left!, a2.top!] : [anchor.left!, anchor.top!];

      group.line.set({ x1, y1, x2, y2 });

      // Remove old spots
      group.spots.forEach((s) => canvas.remove(s));

      // Generate new spots
      editParkingSpotGroup(group.id, (current) => {
        const updated = {
          ...current,
          line: group.line,
        };
        const newSpots = generateSpotsOnLine(updated);
        newSpots.forEach((s) => canvas.add(s));
        updated.spots = newSpots;
        return updated;
      });

      canvas.requestRenderAll();
    };

    const createAnchor = (
      x: number,
      y: number,
      index: 0 | 1
    ): fabric.Circle => {
      const anchor = new fabric.Circle({
        left: x,
        top: y,
        radius: 8,
        fill: "#2196F3",
        stroke: "#000",
        strokeWidth: 1,
        originX: "center",
        originY: "center",
        hasControls: false,
        hasBorders: false,
        selectable: true,
        evented: true,
      });

      anchor.set(FABRIC_META.groupId, group.id);
      anchor.set("isAnchor", true);
      anchor.set(FABRIC_META.objectType, FabricObjectTypes.ParkingSpotGroup);

      anchor.on("moving", () => handleAnchorMove(anchor, index));
      canvas.add(anchor);

      return anchor;
    };

    // Create anchors at both ends of the line
    const a1 = createAnchor(group.line.x1!, group.line.y1!, 0);
    const a2 = createAnchor(group.line.x2!, group.line.y2!, 1);

    // Store anchors references
    anchorRefs.current[group.id] = [a1, a2];
  }

  useEffect(() => {
    if (!canvas || !isActive) return;

    const onMouseDown = (opt: fabric.TEvent) => {
      if (!placingRef.current) return;

      const pointer = canvas.getScenePoint(opt.e as MouseEvent);
      clickRef.current.push(new fabric.Point(pointer.x, pointer.y));

      // If this is the second click, create the line and spots
      if (clickRef.current.length === 2) {
        const [p1, p2] = clickRef.current;
        const id = uuidv4();

        const line = new fabric.Line([p1.x, p1.y, p2.x, p2.y], {
          stroke: "#666",
          strokeWidth: 2,
          strokeDashArray: [5, 5],
          selectable: true,
        });

        line.set(FABRIC_META.customId, id);
        line.set(FABRIC_META.groupId, id);
        line.set(FABRIC_META.objectType, FabricObjectTypes.ParkingSpotGroup);

        canvas.add(line);

        const group: ParkingSpotGroup = {
          id,
          line,
          spotCount: 1,
          spotSize: { width: 30, height: 60 },
          spotAngle: 0,
          spots: [],
        };

        // Generate and add spots
        const spots = generateSpotsOnLine(group);
        spots.forEach((s) => canvas.add(s));
        group.spots = spots;

        // Add to context
        addParkingSpotGroup(group);

        // Add anchors for dragging line endpoints
        addAnchorsToLine(group, canvas);

        // Set selection to this line
        canvas.setActiveObject(line);
        canvas.requestRenderAll();

        // Reset placing state
        placingRef.current = false;
        clickRef.current = [];
      }
    };

    const onSelect = () => setSelectedObject(canvas.getActiveObject() ?? null);
    const onDeselect = () => setSelectedObject(null);

    canvas.on("mouse:down", onMouseDown);
    canvas.on("selection:created", onSelect);
    canvas.on("selection:updated", onSelect);
    canvas.on("selection:cleared", onDeselect);

    return () => {
      canvas.off("mouse:down", onMouseDown);
      canvas.off("selection:created", onSelect);
      canvas.off("selection:updated", onSelect);
      canvas.off("selection:cleared", onDeselect);
    };
  }, [canvas, isActive, addParkingSpotGroup, setSelectedObject]);

  // Control visibility & interactivity based on mode
  useEffect(() => {
    if (!canvas) return;

    canvas.getObjects().forEach((obj) => {
      const type = obj.get(FABRIC_META.objectType);
      const isSpotGroup = type === FabricObjectTypes.ParkingSpotGroup;
      const isAnchor = obj.get("isAnchor");
      const isSpot = obj.get("isSpot");
      const isLine = isSpotGroup && !isAnchor && !isSpot;

      // Set visibility:
      // - Spots are always visible
      // - Lines and anchors are only visible in parking spots mode
      obj.visible = isActive || (!isAnchor && !isLine);

      // Set interactivity
      obj.selectable = isActive && (isSpotGroup || isAnchor);
      obj.evented = isActive && (isSpotGroup || isAnchor);
    });

    canvas.requestRenderAll();
  }, [canvas, isActive]);

  // Public API: allow panel to trigger spot regeneration
  const regenerateSpots = (group: ParkingSpotGroup) => {
    if (!canvas) return;

    group.spots.forEach((s) => canvas.remove(s));
    const newSpots = generateSpotsOnLine(group);
    newSpots.forEach((s) => canvas.add(s));

    editParkingSpotGroup(group.id, (current) => ({
      ...current,
      spots: newSpots,
    }));

    canvas.requestRenderAll();
  };

  return { startPlacing, regenerateSpots };
};

export function generateSpotsOnLine(group: {
  id: string;
  line: fabric.Line;
  spotCount: number;
  spotSize: { width: number; height: number };
  spotAngle: number;
}): fabric.Rect[] {
  const { line, spotCount, spotSize, spotAngle } = group;
  const { x1 = 0, y1 = 0, x2 = 0, y2 = 0 } = line;

  // Calculate spacing between spots
  const lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

  // If no spots or zero length line, return empty array
  if (spotCount <= 0 || lineLength === 0) {
    return [];
  }

  // Distribute spots evenly along the line
  const spots: fabric.Rect[] = [];
  const stepSize = lineLength / (spotCount + 1);
  const lineAngle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

  for (let i = 1; i <= spotCount; i++) {
    // Calculate position along the line (t is 0-1 parameter)
    const t = (i * stepSize) / lineLength;

    // Lerp to find point coordinates
    const cx = x1 + t * (x2 - x1);
    const cy = y1 + t * (y2 - y1);

    // Create rectangle
    const rect = new fabric.Rect({
      width: spotSize.width,
      height: spotSize.height,
      left: cx,
      top: cy,
      fill: "#ccc",
      stroke: "#333",
      strokeWidth: 1,
      originX: "center",
      originY: "center",
      angle: spotAngle,
      selectable: false, // Only select the line, not individual spots
    });

    // Set metadata
    rect.set(FABRIC_META.groupId, group.id);
    rect.set(FABRIC_META.objectType, FabricObjectTypes.ParkingSpotGroup);
    rect.set("isSpot", true);

    spots.push(rect);
  }

  return spots;
}
export default useParkingSpotsMode;