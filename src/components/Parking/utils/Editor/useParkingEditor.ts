// useParkingEditor.ts
import { useState } from "react";
import { ParkingLine, Spot } from "../types";

export const GRID_CELL_SIZE = 10;
export const SHRINK_RATE = 1;

const useParkingEditor = () => {
  const [lines, setLines] = useState<ParkingLine[]>([]);
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);

  const generateSpotsForLine = (line: ParkingLine): Spot[] => {
    const dx = line.end.x - line.start.x;
    const dy = line.end.y - line.start.y;
    const lineLength = Math.sqrt(dx * dx + dy * dy);
    const lineAngleRad = Math.atan2(dy, dx);
    const effectiveAngleRad = lineAngleRad + (line.spotAngle * Math.PI) / 180;
    const spotSpacing = lineLength / line.spotsCount;

    const spots: Spot[] = [];

    for (let i = 0; i < line.spotsCount; i++) {
      const posX =
        line.start.x + Math.cos(lineAngleRad) * (i + 0.5) * spotSpacing;
      const posY =
        line.start.y + Math.sin(lineAngleRad) * (i + 0.5) * spotSpacing;

      spots.push({
        id: `S${line.id}-${i + 1}`,
        x: posX / GRID_CELL_SIZE,
        y: posY / GRID_CELL_SIZE,
        rotation: (effectiveAngleRad * 180) / Math.PI,
        status: "available",
      });
    }
    return spots;
  };

  const updateLine = (lineId: string, updates: Partial<ParkingLine>) => {
    setLines((prev) =>
      prev.map((line) => {
        if (line.id === lineId) {
          const updated = { ...line, ...updates };
          updated.spots = generateSpotsForLine(updated);
          return updated;
        }
        return line;
      })
    );
  };

  const handleMoveWholeLine = (
    lineId: string,
    delta: { x: number; y: number }
  ) => {
    setLines((prev) =>
      prev.map((line) => {
        if (line.id === lineId) {
          const updated = {
            ...line,
            start: { x: line.start.x + delta.x, y: line.start.y + delta.y },
            end: { x: line.end.x + delta.x, y: line.end.y + delta.y },
          };
          updated.spots = generateSpotsForLine(updated);
          return updated;
        }
        return line;
      })
    );
  };

  const handleRotateAroundAnchor = (
    lineId: string,
    point: "start" | "end",
    pos: { x: number; y: number }
  ) => {
    const line = lines.find((l) => l.id === lineId);
    if (!line) return;

    const anchor = point === "start" ? line.end : line.start;

    const dx = pos.x - anchor.x;
    const dy = pos.y - anchor.y;
    const distance = Math.sqrt(dx * dx + dy * dy); // Optional: keep same or allow

    const angle = Math.atan2(dy, dx);

    const newPoint = {
      x: anchor.x + Math.cos(angle) * distance,
      y: anchor.y + Math.sin(angle) * distance,
    };

    if (point === "start") {
      updateLine(lineId, { start: newPoint });
    } else {
      updateLine(lineId, { end: newPoint });
    }
  };

  const deleteLine = (lineId: string) => {
    setLines((prev) => prev.filter((line) => line.id !== lineId));
    setSelectedLineId(null);
  };

  const addLine = (line: ParkingLine) => {
    line.spots = generateSpotsForLine(line);
    setLines((prev) => [...prev, line]);
  };

  return {
    lines,
    selectedLineId,
    setSelectedLineId,
    updateLine,
    handleMoveWholeLine,
    handleDragPoint: (lineId, point, pos) =>
      updateLine(lineId, { [point]: pos }),
    deleteLine,
    addLine,
  };
};

export default useParkingEditor;
