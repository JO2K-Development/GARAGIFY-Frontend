import { useRef, useState } from "react";
import { GRID_CELL_SIZE } from "../ParkingPicker/ParkingPicker";
import parkingData from "../ParkingPicker/mockParkingData.json";
import { init } from "next/dist/compiled/webpack/webpack";
const useParkingPickerTools = () => {
  const containerWidth = 1000;
  const containerHeight = 700;
  const initialScale = 1; // or 0.8 etc.
  const [scale, setScale] = useState(initialScale);

  const parkingWidth = parkingData.grid.columns * GRID_CELL_SIZE;
  const parkingHeight = parkingData.grid.rows * GRID_CELL_SIZE;

  const initialPosition = {
    x: (containerWidth - parkingWidth * initialScale) / 2,
    y: (containerHeight - parkingHeight * initialScale) / 2,
  };

  const stageRef = useRef<any>(null);

  const scaleBy = 1.2;

  const handleZoom = (direction: "in" | "out") => {
    const oldScale = scale;
    const pointer = {
      x: containerWidth / 2,
      y: containerHeight / 2,
    };
    const newScale =
      direction === "in" ? oldScale * scaleBy : oldScale / scaleBy;
    setScale(newScale);

    const stage = stageRef.current;
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    stage.scale({ x: newScale, y: newScale });
    stage.position(newPos);
    stage.batchDraw();
  };

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const oldScale = scale;
    const pointer = stageRef.current.getPointerPosition();

    const zoomIntensity = 0.001; // smaller = smoother
    const newScale = oldScale * Math.exp(-e.evt.deltaY * zoomIntensity);
    setScale(newScale);

    const stage = stageRef.current;
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    stage.scale({ x: newScale, y: newScale });
    stage.position(newPos);
    stage.batchDraw();
  };
  return {
    containerWidth,
    containerHeight,
    scale,
    stageRef,
    handleZoom,
    handleWheel,
    initialPosition,
  };
};

export default useParkingPickerTools;
