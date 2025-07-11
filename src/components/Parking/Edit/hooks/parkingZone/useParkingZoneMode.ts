import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import useCanvasModeBase from "../canvas/useCanvasModeBase";
import createParkingZone from "./createParkingZone";
import { Mode } from "@/components/Parking/Commons/utils/types";
import {
  FabricMeta,
  FabricObjectTypes,
} from "@/components/Parking/Commons/utils/constants";
import { useEditContext } from "../../Context/useEditContext";
import usePreviewLine from "../canvas/usePreviewLine";
import { useCanvas } from "@/components/Parking/Commons/context/CanvasContext";

const useParkingZoneMode = () => {
  const { canvas } = useCanvas();
  const { mode, setSelectedObject, addZone, editZone } = useEditContext();

  const isActive = mode === Mode.PARKING_ZONE;

  const pointsRef = useRef<fabric.Point[]>([]);
  const drawingRef = useRef(false);
  const { onMouseMovePreview, clearPreview } = usePreviewLine({
    drawingRef,
    pointsRef,
    canvas,
  });
  useCanvasModeBase({
    modeName: Mode.PARKING_ZONE,
    onSelect: setSelectedObject,
    onModify: (obj) => {
      const id = obj.get(FabricMeta.OBJECT_ID);
      if (id) {
        editZone(id, (prev) => ({
          ...prev,
          fabricObject: obj,
        }));
      }
    },
    selectableFilter: (obj) =>
      obj.get(FabricMeta.OBJECT_TYPE) === FabricObjectTypes.PARKING_ZONE,
  });

  useEffect(() => {
    if (!canvas || !isActive) return;
    clearPreview();
    const onMouseDown = (opt: fabric.TEvent) => {
      const evt = opt.e as MouseEvent;
      if (evt.ctrlKey || canvas.getActiveObject()) return;

      const pointer = canvas.getScenePoint(evt);

      if (!drawingRef.current) {
        drawingRef.current = true;
        pointsRef.current = [new fabric.Point(pointer.x, pointer.y)];
        return;
      }

      // Finish polygon on double click
      if (evt.detail === 2 && pointsRef.current.length >= 2) {
        const { id, fabricObject: polygon } = createParkingZone(
          pointsRef.current
        );

        canvas.add(polygon);
        canvas.sendObjectToBack(polygon);
        addZone({ id, fabricObject: polygon });

        setTimeout(() => {
          if (!canvas.getActiveObject()) {
            canvas.setActiveObject(polygon);
          }
          canvas.renderAll();
        }, 0);

        drawingRef.current = false;
        clearPreview();
        return;
      }

      pointsRef.current.push(new fabric.Point(pointer.x, pointer.y));
    };

    canvas.on("mouse:down", onMouseDown);
    canvas.on("mouse:move", onMouseMovePreview);

    return () => {
      canvas.off("mouse:down", onMouseDown);
      canvas.off("mouse:move", onMouseMovePreview);
      clearPreview();
      drawingRef.current = false;
      pointsRef.current = [];
    };
  }, [canvas, isActive]); // eslint-disable-line
};

export default useParkingZoneMode;
