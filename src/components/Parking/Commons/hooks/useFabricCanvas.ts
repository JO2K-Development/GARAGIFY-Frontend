import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { createGridPattern } from "../utils/createGridPattern";

const useFabricCanvas = (width = 800, height = 800, gridSize = 50) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas>();

  useEffect(() => {
    let fabricCanvas: fabric.Canvas | null = null;
    let frameId: number;

    frameId = requestAnimationFrame(() => {
      const el = canvasRef.current;
      if (!el) return;

      fabricCanvas = new fabric.Canvas(el, {
        selection: true,
        preserveObjectStacking: true,
      });

      fabricCanvas.setWidth(width);
      fabricCanvas.setHeight(height);
      fabricCanvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

      // Grid background
      fabricCanvas.backgroundColor = createGridPattern();

      fabricCanvas.renderAll();

      setCanvas(fabricCanvas);
    });

    return () => {
      cancelAnimationFrame(frameId);
      fabricCanvas?.dispose();
      setCanvas(undefined);
    };
  }, []);

  return { canvasRef, canvas };
};

export default useFabricCanvas;
