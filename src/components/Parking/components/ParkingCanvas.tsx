"use client";
import React from "react";
import { Button, Select } from "antd";
import styles from "./ParkingCanvas.module.scss";
import { useFabricCanvas } from "../hooks/useFabricCanvas";
import { useCanvasPanning } from "../hooks/useCanvasPanning";
import ZoomControls from "./ZoomControls";
import { useCanvasZoom } from "../hooks/useCanvasZoom";
import { useParkingZoneMode } from "../hooks/modes/useParkingZoneMode";
import { useCanvasContext } from "../context/CanvasContext";
import { useObstacleMode } from "../hooks/modes/useObstacleMode";
import ObstaclePanel from "./ObstaclePanel";
import { useParkingSpotsMode } from "../hooks/modes/useParkingSpotsMode";
import ParkingSpotPanel from "./ParkingSpotPanel";
const { Option } = Select;

type Mode = "parkingZone" | "obstacles" | "parkingSpots" | "view";

const ParkingCanvas = () => {
  const {
    mode,
    setMode,
    selectedObject,
    setSelectedObject,
    removeParkingZone,
    removeObstacle,
  } = useCanvasContext();
  const { canvasRef, canvas } = useFabricCanvas(800, 800);
  const zoomProps = useCanvasZoom(canvas);
  useCanvasPanning(canvas);

  useParkingZoneMode(canvas);
  const { setCurrentType } = useObstacleMode(canvas);

  useParkingSpotsMode(canvas);

  return (
    <div className={styles.container}>
      <Select
        value={mode}
        onChange={(value) => setMode(value as Mode)}
        className={styles.selector}
      >
        <Option value="parkingZone">Parking Zones</Option>
        <Option value="obstacles">Obstacles</Option>
        <Option value="parkingSpots">Parking Spots</Option>
        <Option value="view">View Mode</Option>
      </Select>

      <div className={styles.controls}>
        <ZoomControls {...zoomProps} />
      </div>

      {mode === "parkingSpots" && selectedObject && (
        <div className={styles.panel}>
          <ParkingSpotPanel />

          <Button
            danger
            onClick={() => {
              if (!canvas || !selectedObject) return;

              const groupId = selectedObject.get("groupId");
              if (!groupId) return;

              // Remove all elements with this groupId (spots + line)
              canvas.getObjects().forEach((obj) => {
                if (obj.get("groupId") === groupId) {
                  canvas.remove(obj);
                }
              });

              canvas.discardActiveObject();
              canvas.requestRenderAll();
              setSelectedObject(null);
            }}
          >
            Delete Group
          </Button>
        </div>
      )}

      {mode === "obstacles" && (
        <div className={styles.panel}>
          <ObstaclePanel onSelect={setCurrentType} />
          {selectedObject && (
            <Button
              danger
              onClick={() => {
                if (!canvas || !selectedObject) return;
                canvas.remove(selectedObject);

                const id = selectedObject.get("customId");
                if (id) removeObstacle(id);

                canvas.discardActiveObject();
                canvas.requestRenderAll();
                setSelectedObject(null);
              }}
            >
              Delete
            </Button>
          )}
        </div>
      )}
      <div
        className={styles.panel}
        style={{
          display: mode === "parkingZone" && selectedObject ? "block" : "none",
        }}
      >
        <p>Parking Zone Selected</p>
        <Button
          danger
          onClick={() => {
            if (!canvas || !selectedObject) return;

            canvas.remove(selectedObject);
            const customId = selectedObject?.get("customId");
            if (customId) removeParkingZone(customId); // ✅ remove from context
            canvas.discardActiveObject();
            canvas.requestRenderAll();
            setSelectedObject(null);
          }}
        >
          Delete
        </Button>
      </div>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
};

export default ParkingCanvas;
