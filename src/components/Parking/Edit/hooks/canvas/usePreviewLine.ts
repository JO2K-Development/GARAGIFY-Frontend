import { RefObject, useEffect, useRef } from "react";
import * as fabric from "fabric";
import createShadowLine from "../parkingZone/createShadowLine";

const usePreviewLine = (
  drawingRef: RefObject<boolean>,
  pointsRef: RefObject<fabric.Point[]>,
  canvas?: fabric.Canvas | null
) => {
  const previewRef = useRef<fabric.Polyline | null>(null);
  const onMouseMovePreview = (opt: fabric.TEvent) => {
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

  const clearPreview = () => {
    if (!canvas) return;
    if (previewRef.current) {
      canvas.remove(previewRef.current);
      previewRef.current = null;
    }
  };

  return {
    onMouseMovePreview,
    clearPreview,
  };
};

export default usePreviewLine;
