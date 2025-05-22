import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { createGridPattern } from "../utils/createGridPattern";

const useCreateCanvas = (width = 800, height = 800) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas>();

  useEffect(() => {
    let canvas: fabric.Canvas | null = null;

    const frameId = requestAnimationFrame(() => {
      const el = canvasRef.current;
      if (!el) return;

      canvas = new fabric.Canvas(el, {
        selection: true,
        preserveObjectStacking: true,
      });

      canvas.selection = false;
      canvas.selectionBorderColor = "rgba(0,0,0,0)"; // Transparent
      canvas.selectionColor = "rgba(0,0,0,0)"; // Transparent fill
      canvas.selectionLineWidth = 0;
      canvas.setWidth(width);
      canvas.setHeight(height);
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

      // Grid background
      canvas.backgroundColor = createGridPattern();

      canvas.renderAll();

      setCanvas(canvas);
    });

    return () => {
      cancelAnimationFrame(frameId);
      canvas?.dispose();
      setCanvas(undefined);
    };
  }, [height, width]);

  return { canvasRef, canvas };
};

export default useCreateCanvas;
