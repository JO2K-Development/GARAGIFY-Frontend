import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { useCanvasContext } from "../../context/CanvasContext";
import { v4 as uuidv4 } from "uuid";

export const useObstacleMode = (canvas: fabric.Canvas | null) => {
  const { mode, setSelectedObject, addObstacle, editObstacle } =
    useCanvasContext();
  const isActive = mode === "obstacles";
  const placingRef = useRef(false);
  const currentType = useRef<"tree" | "area">("tree");

  const setCurrentType = (type: "tree" | "area") => {
    currentType.current = type;
    placingRef.current = true; // ✅ enable placing
  };

  useEffect(() => {
    if (!canvas || !isActive) return;

    canvas.selection = true;

    const onMouseDown = (opt: fabric.TEvent) => {
      if (!placingRef.current || !canvas) return;

      const evt = opt.e as MouseEvent;
      if (evt.ctrlKey) return;

      // ✅ Prevent placing if user clicked on any existing object
      const target = canvas.findTarget(evt);
      if (target) return;

      const pointer = canvas.getPointer(evt);
      const id = uuidv4();

      let obj: fabric.Object;
      if (currentType.current === "tree") {
        obj = new fabric.Circle({
          radius: 15,
          fill: "green",
          left: pointer.x,
          top: pointer.y,
          selectable: true,
        });
      } else {
        obj = new fabric.Rect({
          width: 80,
          height: 50,
          fill: "rgba(0, 0, 255, 0.3)",
          stroke: "#0078d4",
          strokeWidth: 1,
          left: pointer.x,
          top: pointer.y,
          selectable: true,
        });
      }

      obj.set("customId", id);
      canvas.add(obj);
      canvas.setActiveObject(obj);
      canvas.requestRenderAll();

      addObstacle({ id, type: currentType.current, fabricObject: obj });

      placingRef.current = false; // stop placing
    };

    const onSelect = () => setSelectedObject(canvas.getActiveObject() ?? null);
    const onDeselect = () => setSelectedObject(null);

    const onModified = (opt: any) => {
      const obj = opt.target;
      if (!obj) return;

      const id = obj.get("customId");
      if (!id) return;

      editObstacle(id, (old) => ({
        ...old,
        fabricObject: obj,
      }));
    };
    canvas.on("object:modified", onModified);
    canvas.on("mouse:down", onMouseDown);
    canvas.on("selection:created", onSelect);
    canvas.on("selection:updated", onSelect);
    canvas.on("selection:cleared", onDeselect);

    return () => {
      canvas.off("mouse:down", onMouseDown);
      canvas.off("selection:created", onSelect);
      canvas.off("selection:updated", onSelect);
      canvas.off("selection:cleared", onDeselect);
      canvas.off("object:modified", onModified);
    };
  }, [canvas, isActive]);

  useEffect(() => {
    if (!canvas) return;

    const toggleInteractivity = () => {
      canvas.getObjects().forEach((obj) => {
        const isObstacle = obj.get("customId") && obj.get("type") !== "polygon"; // polygon = zone
        obj.selectable = isActive && isObstacle;
        obj.evented = isActive && isObstacle;
      });
      canvas.requestRenderAll();
    };

    toggleInteractivity();
  }, [canvas, isActive]);

  return { setCurrentType };
};
