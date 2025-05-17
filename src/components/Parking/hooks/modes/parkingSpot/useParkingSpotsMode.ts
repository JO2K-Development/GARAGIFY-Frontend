import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import {
  ParkingSpotGroup,
  useCanvasContext,
} from "@/components/Parking/context/CanvasContext";
import { Mode } from "@/components/Parking/context/CanvasContext";
import { v4 as uuidv4 } from "uuid";
import useCanvasModeBase from "../useCanvasModeBase";
import { FABRIC_META, FabricObjectTypes } from "@/components/Parking/constants";
import usePreviewLine from "../../canvas/usePreviewLine";

export const removeGroupFromCanvas = (
  canvas: fabric.Canvas | null,
  groupId: string
) => {
  canvas?.getObjects().forEach((obj) => {
    if (obj.get(FABRIC_META.groupId) === groupId) {
      canvas.remove(obj);
    }
  });
};

const useParkingSpotsMode = (canvas: fabric.Canvas | null) => {
  const {
    mode,
    setSelectedObject,
    addParkingSpotGroup,
    editParkingSpotGroup,
    parkingSpotGroups,
  } = useCanvasContext();

  const isActive = mode === Mode.PARKING_SPOTS;

  const drawingRef = useRef(false);
  const pointsRef = useRef<fabric.Point[]>([]);

  const { onMouseMovePreview, clearPreview } = usePreviewLine(
    drawingRef,
    pointsRef,
    canvas
  );
  const generateSpotsOnLine = (group: ParkingSpotGroup): fabric.Rect[] => {
    const { x1, y1, x2, y2 } = group.line;
    const dx = (x2! - x1!) / (group.spotCount + 1);
    const dy = (y2! - y1!) / (group.spotCount + 1);
    const angleDeg = group.spotAngle;

    const spots: fabric.Rect[] = [];

    for (let i = 1; i <= group.spotCount; i++) {
      const cx = x1! + dx * i;
      const cy = y1! + dy * i;

      const rect = new fabric.Rect({
        width: group.spotSize.width,
        height: group.spotSize.height,
        left: cx,
        top: cy,
        angle: angleDeg,
        fill: "#bbb",
        stroke: "#444",
        strokeWidth: 1,
        originX: "center",
        originY: "center",
        selectable: false,
        evented: false,
      });

      rect.set(FABRIC_META.objectType, FabricObjectTypes.ParkingSpotGroup);
      rect.set(FABRIC_META.groupId, group.id);

      spots.push(rect);
    }

    return spots;
  };

  const regenerateSpots = (group: ParkingSpotGroup) => {
    const existingSpots = canvas
      ?.getObjects()
      .filter(
        (obj) =>
          obj.get(FABRIC_META.groupId) === group.id &&
          obj.get(FABRIC_META.objectType) ===
            FabricObjectTypes.ParkingSpotGroup &&
          obj instanceof fabric.Rect
      ) as fabric.Rect[];

    existingSpots.forEach((spot) => canvas?.remove(spot));

    const newSpots = generateSpotsOnLine(group);
    newSpots.forEach((s) => canvas?.add(s));
    group.spots = newSpots;
    canvas?.requestRenderAll();
  };

  const createSpotGroup = (p1: fabric.Point, p2: fabric.Point) => {
    const id = uuidv4();

    const line = new fabric.Line([p1.x, p1.y, p2.x, p2.y], {
      stroke: "#666",
      strokeWidth: 2,
      selectable: false,
      evented: false,
    });
    line.set(FABRIC_META.customId, id);
    line.set(FABRIC_META.objectType, FabricObjectTypes.ParkingSpotGroup);
    line.set(FABRIC_META.groupId, id); //

    const group: ParkingSpotGroup = {
      id,
      line,
      spots: [],
      spotCount: 1,
      spotSize: { width: 40, height: 60 },
      spotAngle: 0,
    };

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

      anchor.set(FABRIC_META.groupId, id);
      anchor.set("isAnchor", true);

      anchor.on("moving", () => {
        const x = anchor.left!;
        const y = anchor.top!;

        if (index === 0) line.set({ x1: x, y1: y });
        else line.set({ x2: x, y2: y });

        editParkingSpotGroup(id, (prev) => {
          const updated = { ...prev, line };
          regenerateSpots(updated);
          return updated;
        });
      });

      canvas?.add(anchor);
    };

    createAnchor(p1.x, p1.y, 0);
    createAnchor(p2.x, p2.y, 1);

    const spots = generateSpotsOnLine(group);
    spots.forEach((s) => canvas?.add(s));
    group.spots = spots;

    canvas?.add(line);
    addParkingSpotGroup(group);
  };

  useEffect(() => {
    if (!canvas || !isActive) return;

    clearPreview();
    const onMouseDown = (opt: fabric.TEvent) => {
      const evt = opt.e as MouseEvent;
      if (evt.ctrlKey || canvas.getActiveObject()) return;

      const target = canvas.findTarget(evt);
      if (target) return;

      const pointer = canvas.getScenePoint(evt);

      if (!drawingRef.current) {
        drawingRef.current = true;
        pointsRef.current = [pointer];
        return;
      }

      pointsRef.current.push(pointer);
      if (pointsRef.current.length === 2) {
        createSpotGroup(pointsRef.current[0], pointsRef.current[1]);
        drawingRef.current = false;
        pointsRef.current = [];

        clearPreview();

        canvas.renderAll();
      }
    };

    canvas.on("mouse:down", onMouseDown);
    canvas.on("mouse:move", onMouseMovePreview);
    return () => {
      canvas.off("mouse:down", onMouseDown);
      canvas.off("mouse:move", onMouseMovePreview);
      clearPreview();
      pointsRef.current = [];
      drawingRef.current = false;
    };
  }, [canvas, isActive]);

  useCanvasModeBase({
    canvas,
    modeName: Mode.PARKING_SPOTS,
    onSelect: (obj) => {
      if (obj) {
        obj.set({
          hasControls: false,
          lockScalingX: true,
          lockScalingY: true,
          lockRotation: true,
        });
        drawingRef.current = false;
      }
      setSelectedObject(obj ?? null);
    },
    onModify: (obj) => {
      const id = obj.get(FABRIC_META.customId);
      if (!id) return;
      editParkingSpotGroup(id, (prev) => {
        const updated = { ...prev, line: obj as fabric.Line };
        regenerateSpots(updated);
        return updated;
      });
    },
    selectableFilter: (obj) =>
      obj.get(FABRIC_META.objectType) === FabricObjectTypes.ParkingSpotGroup ||
      obj.get("isAnchor") === true,
  });

  useEffect(() => {
    if (!canvas || !isActive) return;
    parkingSpotGroups.forEach((group) => {
      regenerateSpots(group);
    });
  }, [parkingSpotGroups, canvas, isActive]);
};

export default useParkingSpotsMode;
