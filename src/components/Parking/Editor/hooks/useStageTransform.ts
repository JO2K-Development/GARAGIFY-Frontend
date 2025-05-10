"use client";
import { useRef } from "react";
import { HandlerType } from "../../utils/types";

const useStageTransform = () => {
  const stageRef = useRef<any>(null);

  const handleZoom = (dir: "in" | "out") => {
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const scaleBy = 1.2;
    const mousePointTo = {
      x: stage.width() / 2 / oldScale - stage.x() / oldScale,
      y: stage.height() / 2 / oldScale - stage.y() / oldScale,
    };

    const newScale = dir === "in" ? oldScale * scaleBy : oldScale / scaleBy;
    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: -(mousePointTo.x - stage.width() / 2 / newScale) * newScale,
      y: -(mousePointTo.y - stage.height() / 2 / newScale) * newScale,
    };

    stage.position(newPos);
    stage.batchDraw();
  };

  const handlePanMouseDown: HandlerType = (e) => {
    if (e.evt.button === 1) {
      const stage = stageRef.current;
      stage.draggable(true);
      stage.startDrag();
      return true;
    }
    return false;
  };

  const handlePanMouseUp: HandlerType = (e) => {
    const stage = stageRef.current;
    stage.draggable(false);
    return false;
  };
  return {
    stageRef,
    handleZoom,
    handlePanMouseDown,
    handlePanMouseUp,
  };
};

export default useStageTransform;
