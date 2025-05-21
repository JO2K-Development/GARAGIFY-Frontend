"use client";
import React from "react";
import styles from "./ParkingCanvas.module.scss";
import ZoomControls from "../ZoomControls";
import ModeSelector from "../../../Edit/components/ModeSelector/ModeSelector";
import ModePanel from "../../../Edit/components/panels/ModePanel";
import useFabricCanvas from "../../hooks/useFabricCanvas";
import { useParkingViewRender } from "@/components/Parking/View/useParkingView";
import useCanvasPanning from "../../hooks/useCanvasPanning";

interface ParkingCanvasProps {
  viewMode?: boolean;
}
const ParkingCanvas = ({
  viewMode = false, // Default to false if not provided
}: ParkingCanvasProps) => {
  const { canvasRef, canvas } = useFabricCanvas(800, 800);
  useCanvasPanning(viewMode, canvas);

  useParkingViewRender(canvas, viewMode);
  return (
    <div className={styles.container}>
      {!viewMode && (
        <>
          <ModeSelector />
          <div className={styles.panel}>
            <ModePanel canvas={canvas} />
          </div>
        </>
      )}
      <div className={styles.controls}>
        <ZoomControls canvas={canvas} />
      </div>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
};

export default ParkingCanvas;
