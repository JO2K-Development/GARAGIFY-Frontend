import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";

export const useFabricCanvas = (width = 800, height = 800, gridSize = 50) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

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
      const gridCanvas = document.createElement("canvas");
      gridCanvas.width = gridSize;
      gridCanvas.height = gridSize;
      const ctx = gridCanvas.getContext("2d")!;
      ctx.strokeStyle = "#ddd";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, gridSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(gridSize, 0);
      ctx.stroke();

      fabricCanvas.backgroundColor = new fabric.Pattern({
        source: gridCanvas,
        repeat: "repeat",
      });

      fabricCanvas.renderAll();

      setCanvas(fabricCanvas);
    });

    return () => {
      cancelAnimationFrame(frameId);
      fabricCanvas?.dispose();
      setCanvas(null);
    };
  }, []);

  return { canvasRef, canvas };
};
