"use client";
import { useCanvas } from "../../Commons/context/CanvasContext";
import useCanvasPanning from "../../Commons/hooks/useCanvasPanning";
import { useParkingViewRender } from "../useParkingView";
import styles from "./ViewCanvas.module.scss";
const ViewCanvas = () => {
  const { canvasRef } = useCanvas();
  useCanvasPanning();
  useParkingViewRender();
  return (
    <>
      <div />
      <canvas ref={canvasRef} className={styles.canvas} />
    </>
  );
};

export default ViewCanvas;
