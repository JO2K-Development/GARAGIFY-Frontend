import { useCallback } from "react";
import * as fabric from "fabric";
import WithCanvas from "../utils/WithCanvas";

const useCanvasZoom = ({ canvas }: WithCanvas) => {
  const zoom = useCallback(
    (factor: number) => {
      if (!canvas) return;
      const currentZoom = canvas.getZoom();
      const zoom = currentZoom * factor;
      canvas.zoomToPoint(
        new fabric.Point(canvas.width! / 2, canvas.height! / 2),
        zoom
      );
    },
    [canvas]
  );

  return {
    onZoomIn: () => zoom(1.1),
    onZoomOut: () => zoom(0.9),
  };
};

export default useCanvasZoom;
