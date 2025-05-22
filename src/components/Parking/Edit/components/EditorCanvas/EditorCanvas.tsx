"use client";
import useCanvasPanning from "@/components/Parking/Commons/hooks/useCanvasPanning";
import ModeSelector from "../ModeSelector/ModeSelector";
import ModePanel from "../ModePanel/ModePanel";
import styles from "./EditorCanvas.module.scss";
import { useCanvas } from "@/components/Parking/Commons/context/CanvasContext";
const EditorCanvas = () => {
  const { canvasRef } = useCanvas();
  useCanvasPanning();
  return (
    <>
      <ModeSelector />
      <ModePanel />
      <div />
      <canvas ref={canvasRef} className={styles.canvas} />
    </>
  );
};
export default EditorCanvas;
