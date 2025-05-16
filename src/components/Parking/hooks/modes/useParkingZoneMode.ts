import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { useCanvasContext } from "../../context/CanvasContext";
import { v4 as uuidv4 } from "uuid";

export const useParkingZoneMode = (canvas: fabric.Canvas | null) => {
  const pointsRef = useRef<fabric.Point[]>([]);
  const previewPolygonRef = useRef<fabric.Polyline | null>(null);
  const isDrawingRef = useRef(false);

  const {
    mode,
    addParkingZone,
    setSelectedObject,
    editParkingZone,
    parkingZones,
  } = useCanvasContext();
  const isActive = mode === "parkingZone";

  useEffect(() => {
    if (!canvas || !isActive) return;

    canvas.selection = false;

    const clearPreview = () => {
      if (previewPolygonRef.current) {
        canvas.remove(previewPolygonRef.current);
        previewPolygonRef.current = null;
      }
    };

    const onMouseDown = (opt: fabric.TEvent) => {
      const evt = opt.e as MouseEvent;
      if (evt.ctrlKey || canvas.getActiveObject() || !isActive) return;

      const pointer = canvas.getPointer(evt);

      if (!isDrawingRef.current) {
        isDrawingRef.current = true;
        pointsRef.current = [new fabric.Point(pointer.x, pointer.y)];
        return;
      }

      if (evt.detail === 2 && pointsRef.current.length >= 2) {
        const polygon = new fabric.Polygon([...pointsRef.current], {
          fill: "rgba(0, 128, 255, 0.3)",
          stroke: "#0078d4",
          strokeWidth: 2,
          selectable: true,
          objectCaching: false,
        });

        const id = uuidv4();
        polygon.set("customId", id);
        polygon.set("objectType", "parkingZone"); // 👈 Add this!
        canvas.add(polygon);

        addParkingZone({ id, fabricObject: polygon });

        setTimeout(() => {
          if (!canvas.getActiveObject()) {
            canvas.setActiveObject(polygon);
          }
          canvas.renderAll();
        }, 0);

        return;
      }

      pointsRef.current.push(new fabric.Point(pointer.x, pointer.y));
    };

    const onMouseMove = (opt: fabric.TEvent) => {
      if (!isDrawingRef.current || pointsRef.current.length === 0 || !canvas)
        return;

      const pointer = canvas.getPointer(opt.e);
      const tempPoints = [
        ...pointsRef.current,
        new fabric.Point(pointer.x, pointer.y),
      ];
      const polygonPoints = tempPoints.map((p) => ({ x: p.x, y: p.y }));

      if (!previewPolygonRef.current) {
        previewPolygonRef.current = new fabric.Polyline(polygonPoints, {
          stroke: "#0078d4",
          strokeDashArray: [5, 5],
          strokeWidth: 1,
          fill: "transparent",
          selectable: false,
          evented: false,
          objectCaching: false,
        });
        canvas.add(previewPolygonRef.current);
      } else {
        previewPolygonRef.current.set({ points: polygonPoints });
        previewPolygonRef.current.setCoords();
      }

      canvas.renderAll();
    };

    const onSelection = () => {
      setSelectedObject(canvas.getActiveObject() ?? null);
    };

    const onClearSelection = () => {
      setSelectedObject(null);
      isDrawingRef.current = false;
    };

    const onModified = (opt: any) => {
      const obj = opt.target;
      if (!obj) return;

      const id = obj.get("customId");
      if (!id) return;

      editParkingZone(id, (prev) => ({
        ...prev,
        fabricObject: obj,
      }));
    };
    canvas.on("object:modified", onModified);
    canvas.on("mouse:down", onMouseDown);
    canvas.on("mouse:move", onMouseMove);
    canvas.on("selection:created", onSelection);
    canvas.on("selection:updated", onSelection);
    canvas.on("selection:cleared", onClearSelection);

    return () => {
      canvas.off("mouse:down", onMouseDown);
      canvas.off("mouse:move", onMouseMove);
      canvas.off("selection:created", onSelection);
      canvas.off("selection:updated", onSelection);
      canvas.off("selection:cleared", onClearSelection);
      canvas.off("object:modified", onModified);
      clearPreview();
      pointsRef.current = [];
      isDrawingRef.current = false;
      canvas.selection = true;
    };
  }, [canvas, isActive, setSelectedObject, addParkingZone]);

  useEffect(() => {
    if (!canvas) return;

    canvas.getObjects().forEach((obj) => {
      const isZone = obj.get("objectType") === "parkingZone";
      obj.selectable = isActive && isZone;
      obj.evented = isActive && isZone;
    });

    canvas.requestRenderAll();
  }, [canvas, isActive, parkingZones]);
};
