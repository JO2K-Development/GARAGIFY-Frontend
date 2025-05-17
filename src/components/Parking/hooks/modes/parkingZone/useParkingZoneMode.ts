import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { Mode, useCanvasContext } from "../../../context/CanvasContext";
import useCanvasModeBase from "../useCanvasModeBase";
import { FABRIC_META, FabricObjectTypes } from "../../../constants";
import createParkingZone from "./createParkingZone";
import createShadowLine from "./createShadowLine";

const useParkingZoneMode = (canvas: fabric.Canvas | null) => {
  const { mode, setSelectedObject, addParkingZone, editParkingZone } =
    useCanvasContext();

  const isActive = mode === Mode.PARKING_ZONE;

  const pointsRef = useRef<fabric.Point[]>([]);
  const previewRef = useRef<fabric.Polyline | null>(null);
  const drawingRef = useRef(false);

  useCanvasModeBase({
    canvas,
    modeName: Mode.PARKING_ZONE,
    onSelect: setSelectedObject,
    onModify: (obj) => {
      const id = obj.get(FABRIC_META.customId);
      if (id) {
        editParkingZone(id, (prev) => ({
          ...prev,
          fabricObject: obj,
        }));
      }
    },
    selectableFilter: (obj) =>
      obj.get(FABRIC_META.objectType) === FabricObjectTypes.ParkingZone,
  });

  useEffect(() => {
    if (!canvas || !isActive) return;

    const clearPreview = () => {
      if (previewRef.current) {
        canvas.remove(previewRef.current);
        previewRef.current = null;
      }
    };

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
        addParkingZone({ id, fabricObject: polygon });

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

    const onMouseMove = (opt: fabric.TEvent) => {
      if (!drawingRef.current || pointsRef.current.length === 0 || !canvas)
        return;

      const pointer = canvas.getScenePoint(opt.e);
      const tempPoints = [
        ...pointsRef.current,
        new fabric.Point(pointer.x, pointer.y),
      ];
      const polygonPoints = tempPoints.map((p) => ({ x: p.x, y: p.y }));

      if (!previewRef.current) {
        previewRef.current = createShadowLine(tempPoints);
        canvas.add(previewRef.current);
      } else {
        previewRef.current.set({ points: polygonPoints });
        previewRef.current.setCoords();
      }

      canvas.renderAll();
    };

    canvas.on("mouse:down", onMouseDown);
    canvas.on("mouse:move", onMouseMove);

    return () => {
      canvas.off("mouse:down", onMouseDown);
      canvas.off("mouse:move", onMouseMove);
      clearPreview();
      drawingRef.current = false;
      pointsRef.current = [];
    };
  }, [canvas, isActive]);
};

export default useParkingZoneMode;
