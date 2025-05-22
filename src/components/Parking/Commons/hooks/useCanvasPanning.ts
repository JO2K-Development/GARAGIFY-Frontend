import { useEffect } from "react";
import type { TEvent } from "fabric";
import { useCanvas } from "../context/CanvasContext";

const useCanvasPanning = () => {
  const { canvas } = useCanvas();
  useEffect(() => {
    if (!canvas) return;

    let isPanning = false;
    let lastX = 0;
    let lastY = 0;

    const onMouseDown = (opt: TEvent) => {
      const evt = opt.e as MouseEvent;
      if (evt.button === 0 && evt.ctrlKey) {
        isPanning = true;
        lastX = evt.clientX;
        lastY = evt.clientY;
        canvas.selection = false;
        canvas.defaultCursor = "grab";
        evt.preventDefault();
      }
    };

    const onMouseMove = (opt: TEvent) => {
      if (!isPanning) return;
      const evt = opt.e as MouseEvent;
      const deltaX = evt.clientX - lastX;
      const deltaY = evt.clientY - lastY;

      const vpt = canvas.viewportTransform!;
      vpt[4] += deltaX;
      vpt[5] += deltaY;
      canvas.requestRenderAll();

      lastX = evt.clientX;
      lastY = evt.clientY;
    };

    const onMouseUp = () => {
      isPanning = false;
      canvas.selection = true;
      canvas.defaultCursor = "default";
    };

    canvas.on("mouse:down", onMouseDown);
    canvas.on("mouse:move", onMouseMove);
    canvas.on("mouse:up", onMouseUp);

    return () => {
      canvas.off("mouse:down", onMouseDown);
      canvas.off("mouse:move", onMouseMove);
      canvas.off("mouse:up", onMouseUp);
    };
  }, [canvas]);
};

export default useCanvasPanning;
