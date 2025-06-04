import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { createGridPattern } from "../utils/createGridPattern";

// Helper for responsive size
const getResponsiveSize = () => {
  if (typeof window === "undefined") return { width: 800, height: 800 };
  if (window.innerWidth < 1500) return { width: 300, height: 300 };
  return { width: 600, height: 600 };
};

const useCreateCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas>();
  const [size, setSize] = useState(getResponsiveSize());

  // Listen for resize
  useEffect(() => {
    const handleResize = () => setSize(getResponsiveSize());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Only create Fabric canvas once
  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      selection: true,
      preserveObjectStacking: true,
    });

    fabricCanvas.selection = false;
    fabricCanvas.selectionBorderColor = "rgba(0,0,0,0)";
    fabricCanvas.selectionColor = "rgba(0,0,0,0)";
    fabricCanvas.selectionLineWidth = 0;
    fabricCanvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    fabricCanvas.backgroundColor = createGridPattern();
    fabricCanvas.renderAll();

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
      setCanvas(undefined);
    };
  }, []); // only once, not on size change!

  // When size changes, update canvas dimensions, NOT the instance
  useEffect(() => {
    if (canvas) {
      canvas.setWidth(size.width);
      canvas.setHeight(size.height);
      const defaultZoom = Math.min(canvas.width! / 800, canvas.height! / 800);
      canvas.setZoom(defaultZoom);
      canvas.renderAll();
    }
  }, [canvas, size.width, size.height]);

  return { canvasRef, canvas, width: size.width, height: size.height };
};

export default useCreateCanvas;
