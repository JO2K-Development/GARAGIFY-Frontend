"use client";
import React, { PropsWithChildren } from "react";
import styles from "./ParkingWrapper.module.scss";
import ZoomControls from "../ZoomControls/ZoomControls";
import useCreateCanvas from "../../hooks/useCreateCanvas";
import { CanvasContext } from "../../context/CanvasContext";

const ParkingWrapper = ({ children }: PropsWithChildren) => {
  const { canvasRef, canvas } = useCreateCanvas(800, 800);
  return (
    <div className={styles.container}>
      <CanvasContext.Provider value={{ canvasRef, canvas }}>
        <ZoomControls />
        {children}
      </CanvasContext.Provider>
    </div>
  );
};

export default ParkingWrapper;
