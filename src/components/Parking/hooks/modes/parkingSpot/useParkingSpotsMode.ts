import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import {
  ParkingSpotGroup,
  useCanvasContext,
} from "@/components/Parking/context/CanvasContext";
import { Mode } from "@/components/Parking/context/CanvasContext";
import useCanvasModeBase from "../useCanvasModeBase";
import { FABRIC_META, FabricObjectTypes } from "@/components/Parking/constants";
import usePreviewLine from "../../canvas/usePreviewLine";
import { regenerateSpots } from "./spotsGeneration";
import createSpotGroup from "./createSpotGroup";

const useParkingSpotsMode = (canvas: fabric.Canvas) => {
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
        createSpotGroup({
          canvas,
          addParkingSpotGroup,
          editParkingSpotGroup,
          p1: pointsRef.current[0],
          p2: pointsRef.current[1],
        });
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
      console.log("Selected object:", obj);
      clearPreview();
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
        regenerateSpots(updated, canvas);
        return updated;
      });
    },
    selectableFilter: (obj) =>
      obj.get(FABRIC_META.objectType) === FabricObjectTypes.ParkingSpotGroup,
  });

  useEffect(() => {
    if (!canvas || !isActive) return;
    parkingSpotGroups.forEach((group) => {
      regenerateSpots(group, canvas);
    });
  }, [parkingSpotGroups, canvas, isActive]);
};

export default useParkingSpotsMode;
