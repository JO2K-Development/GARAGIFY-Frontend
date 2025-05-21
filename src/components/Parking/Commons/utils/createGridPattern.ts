// utils/fabricGrid.ts
import * as fabric from "fabric";

export function createGridPattern(gridSize = 50): fabric.Pattern {
  const gridCanvas = document.createElement("canvas");
  gridCanvas.width = gridSize;
  gridCanvas.height = gridSize;
  const ctx = gridCanvas.getContext("2d")!;
  ctx.strokeStyle = "#ddd";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, gridSize);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(gridSize, 0);
  ctx.stroke();

  return new fabric.Pattern({
    source: gridCanvas,
    repeat: "repeat",
  });
}
