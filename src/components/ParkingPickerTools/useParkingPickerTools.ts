import { useRef, useState } from "react";
import { GRID_CELL_SIZE } from "../ParkingPicker/ParkingPicker";
import parkingData from "../ParkingPicker/mockParkingData.json";
import { init } from "next/dist/compiled/webpack/webpack";
const useParkingPickerTools = () => {
  const containerWidth = 1000;
  const containerHeight = 700;
  const parkingWidth = 500; // example
  const parkingHeight = 500; // example

  const stageRef = useRef<any>(null);
  const initialScale = 1;
  const scaleBy = 1.2;

  const initialPosition = {
    x: (containerWidth - parkingWidth * initialScale) / 2,
    y: (containerHeight - parkingHeight * initialScale) / 2,
  };

  const handleZoom = (direction: "in" | "out") => {
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = {
      x: containerWidth / 2,
      y: containerHeight / 2,
    };

    const newScale =
      direction === "in" ? oldScale * scaleBy : oldScale / scaleBy;
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    stage.scale({ x: newScale, y: newScale });
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    stage.position(newPos);
    stage.batchDraw();
  };

  return {
    containerWidth,
    containerHeight,
    stageRef,
    handleZoom,
    initialPosition,
  };
};

export default useParkingPickerTools;
