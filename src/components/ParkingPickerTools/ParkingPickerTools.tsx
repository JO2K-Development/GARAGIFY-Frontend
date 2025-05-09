"use client";
import { Stage, Layer, Rect } from "react-konva";
import ParkingPicker from "../ParkingPicker/ParkingPicker";
import useParkingPickerTools from "./useParkingPickerTools";
import { Button, Space } from "antd";

const ParkingPickerTools = () => {
  const {
    scale,
    stageRef,
    handleZoom,
    handleWheel,
    containerHeight,
    containerWidth,
    initialPosition
  } = useParkingPickerTools();

  return (
    <div
      style={{
        position: "relative",
        width: `${containerWidth}px`,
        height: `${containerHeight}px`,
        border: "1px solid black",
        background: "#ddd", // container background
      }}
    >
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 1 }}>
        <Space>
          <Button type="primary" onClick={() => handleZoom("in")}>
            Zoom In
          </Button>
          <Button onClick={() => handleZoom("out")}>Zoom Out</Button>
        </Space>
      </div>

      <Stage
        ref={stageRef}
        width={containerWidth}
        height={containerHeight}
        draggable
        onWheel={handleWheel}
        scaleX={scale}
        scaleY={scale}
        x={initialPosition.x}
        y={initialPosition.y}
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            width={containerWidth}
            height={containerHeight}
            fill="#e0e0e0"
          />
          <ParkingPicker />
        </Layer>
      </Stage>
    </div>
  );
};

export default ParkingPickerTools;
