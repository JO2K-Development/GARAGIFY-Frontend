import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import {
  FabricMeta,
  FabricObjectTypes,
} from "@/components/Parking/Commons/utils/constants";
import usePreviewLine from "../canvas/usePreviewLine";
import { regenerateSpots } from "./spotsGeneration";
import createSpotGroup from "./createSpotGroup";
import { Mode } from "@/components/Parking/Commons/utils/types";
import { useEditContext } from "../../Context/useEditContext";
import useCanvasModeBase from "../canvas/useCanvasModeBase";
import { useCanvas } from "@/components/Parking/Commons/context/CanvasContext";

const useParkingSpotsMode = () => {
  const { canvas } = useCanvas();
  const {
    mode,
    setSelectedObject,
    addSpotGroup,
    editSpotGroup,
    parking: { spotGroups },
  } = useEditContext();

  const isActive = mode === Mode.PARKING_SPOTS;

  const drawingRef = useRef(false);
  const pointsRef = useRef<fabric.Point[]>([]);

  const { onMouseMovePreview, clearPreview } = usePreviewLine({
    drawingRef,
    pointsRef,
    canvas,
  });

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
          addParkingSpotGroup: addSpotGroup,
          editParkingSpotGroup: editSpotGroup,
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
      const id = obj.get(FabricMeta.OBJECT_ID);
      if (!id) return;
      editSpotGroup(id, (prev) => {
        const updated = { ...prev, line: obj as fabric.Line };
        regenerateSpots({ group: updated, canvas });
        return updated;
      });
    },
    selectableFilter: (obj) =>
      obj.get(FabricMeta.OBJECT_TYPE) === FabricObjectTypes.PARKING_GROUP,
  });

  useEffect(() => {
    if (!canvas || !isActive) return;
    spotGroups.forEach((group) => {
      regenerateSpots({ group, canvas });
    });
  }, [spotGroups, canvas, isActive]);
};

export default useParkingSpotsMode;
