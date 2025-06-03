import { use, useEffect, useRef } from "react";
import { useParkingViewContext } from "./ParkingViewContext";
import * as fabric from "fabric";
import { createGridPattern } from "../Commons/utils/createGridPattern";
import { FabricMeta, FabricObjectTypes } from "../Commons/utils/constants";
import { useCanvas } from "../Commons/context/CanvasContext";
import { useSpot } from "@/context/SpotProvider";
import { set } from "react-hook-form";

function setSpotSelectable(spot: fabric.Rect) {
  spot.selectable = false;
  spot.evented = true;
  spot.hasControls = false;
  spot.hoverCursor = "pointer";
}

function setNonInteractive(obj: fabric.Object) {
  obj.selectable = false;
  obj.evented = false;
  obj.hoverCursor = "default";
}

export function useParkingViewRender() {
  const { canvas } = useCanvas();
  const { parking } = useParkingViewContext();
  const didRender = useRef(false);
  const { setSelectedSpotId, selectedSpotId, disabledSpotIds } = useSpot();

  useEffect(() => {
    if (!canvas || didRender.current) return;
    didRender.current = true;

    canvas.clear();
    canvas.backgroundColor = createGridPattern();

    if (!parking) return;

    parking.zones.forEach((zone) => {
      setNonInteractive(zone.fabricObject);
      canvas.add(zone.fabricObject);
    });

    parking.obstacles.forEach((obs) => {
      setNonInteractive(obs.fabricObject);
      canvas.add(obs.fabricObject);
    });

    parking.spotGroups.forEach((group) => {
      group.spots.forEach((spot) => {
        setSpotSelectable(spot);
        const spotId = (spot as any)[FabricMeta.SPOT_ID];
        if (disabledSpotIds.includes(spotId)) {
          spot.set("fill", "#ddd");
          setNonInteractive(spot);
        } else {
          spot.set("fill", "#49aa19");
        }
        canvas.add(spot);
      });
    });

    canvas.selectionBorderColor = "#e33327";
    canvas.requestRenderAll();
  }, [canvas, parking]);
  useEffect(() => {
    if (!canvas) return;

    const onRectClick = (e: any) => {
      const obj = e.target;
      if (
        obj instanceof fabric.Rect &&
        obj.get(FabricMeta.OBJECT_TYPE) === FabricObjectTypes.PARKING_GROUP
      ) {
        setSelectedSpotId((obj as unknown as any)[FabricMeta.SPOT_ID] || null);
      }
    };

    canvas.on("mouse:down", onRectClick);
    return () => {
      canvas.off("mouse:down", onRectClick);
    };
  }, [canvas, setSelectedSpotId]);
  useEffect(() => {
    if (!canvas || !parking) return;
    parking.spotGroups.forEach((group) => {
      group.spots.forEach((spot) => {
        setSpotSelectable(spot);
        const spotId = (spot as any)[FabricMeta.SPOT_ID];
        if (disabledSpotIds.includes(spotId)) {
          setNonInteractive(spot);
          spot.set("fill", "#ddd"); // Keep disabled color
        } else if (spotId === selectedSpotId) {
          spot.set("fill", "#e33327"); // Selected color
        } else {
          spot.set("fill", "#49aa19"); // Default color
        }
      });
    });
    canvas.requestRenderAll();
  }, [selectedSpotId, canvas, parking, disabledSpotIds]);

}
