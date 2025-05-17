"use client";
import React from "react";
import styles from "./ParkingCanvas.module.scss";
import useFabricCanvas from "../../hooks/canvas/useFabricCanvas";
import ZoomControls from "../ZoomControls";
import ModeSelector from "../ModeSelector/ModeSelector";
import ModePanel from "../panels/ModePanel";

const ParkingCanvas = () => {
  const { canvasRef, canvas } = useFabricCanvas(800, 800);

  return (
    <div className={styles.container}>
      {canvas && (
        <>
          <ModeSelector />
          <div className={styles.panel}>
            <ModePanel canvas={canvas} />
          </div>
          <div className={styles.controls}>
            <ZoomControls canvas={canvas} />
          </div>
        </>
      )}
      <div />
      {/* Solves: Error: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node */}
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
};

export default ParkingCanvas;
