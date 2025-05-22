// src/Context/CanvasContext.js
import { createContext, useContext } from "react";
import * as fabric from "fabric";

export interface CanvasContextType {
  canvasRef: React.RefObject<HTMLCanvasElement | null> | null;
  canvas?: fabric.Canvas;
}
export const CanvasContext = createContext<CanvasContextType | undefined>(
  undefined
);

export const useCanvas = (): CanvasContextType => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error("useCanvas must be used within a CanvasContext.Provider");
  }
  return context;
};
