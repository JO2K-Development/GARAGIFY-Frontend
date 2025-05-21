import { useEffect, useRef } from "react";
import { useParkingViewContext } from "./ParkingViewContext"; // adjust path as needed
import * as fabric from "fabric";
import { createGridPattern } from "../Commons/utils/createGridPattern";
import WithCanvas from "../Commons/utils/WithCanvas";
import WithViewMode from "../Commons/utils/WithViewMode";

// Helper to set all fabric objects as non-interactive
function setNonInteractive(obj: fabric.Object) {
  obj.selectable = false;
  obj.evented = false;
  obj.hoverCursor = "default";
}

export function useParkingViewRender({
  canvas,
  viewMode,
}: WithCanvas<WithViewMode>) {
  const { parking } = useParkingViewContext();
  const didRender = useRef(false);

  useEffect(() => {
    if (!canvas || !viewMode || didRender.current) return;
    didRender.current = true;

    canvas.clear();

    // Restore grid background after clear!
    canvas.backgroundColor = createGridPattern();

    // Render zones
    parking.zones.forEach((zone) => {
      setNonInteractive(zone.fabricObject);
      canvas.add(zone.fabricObject);
    });

    // Render obstacles
    parking.obstacles.forEach((obs) => {
      setNonInteractive(obs.fabricObject);
      canvas.add(obs.fabricObject);
    });

    // Render spot groups (spots only)
    parking.spotGroups.forEach((group) => {
      group.spots.forEach((spot) => {
        setNonInteractive(spot);
        canvas.add(spot);
      });
    });

    canvas.requestRenderAll();

    // If you ever need to clean up: canvas.clear() on unmount
    // (Not needed here unless you switch between multiple parkings in one canvas instance.)
    // return () => canvas.clear();

    // eslint-disable-next-line
  }, [canvas, viewMode]);
}
