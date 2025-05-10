// useParkingEditor.ts
import { useState } from "react";
import {
  ParkingLine,
  Point,
  ParkingSpot,
  HandlerType,
} from "../../../utils/types";
import { HandleCircleDrag } from "./types";

export const GRID_CELL_SIZE = 10;

interface ParkingEditorProps {
  handlePanMouseDown: HandlerType;
  handlePanMouseMove: HandlerType;
  handlePanMouseUp: HandlerType;
  stageRef: React.RefObject<any>;
}
const useParkingEditor = ({
  handlePanMouseDown,
  handlePanMouseMove,
  handlePanMouseUp,
  stageRef,
}: ParkingEditorProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<Point | null>(null);
  const [currentPos, setCurrentPos] = useState<Point | null>(null);

  const handleMouseDown: HandlerType = (e) => {
    if (handlePanMouseDown(e)) return;

    const stage = stageRef.current;
    const pointerPos = stage.getPointerPosition();
    const transform = stage.getAbsoluteTransform().copy().invert();
    const pos = transform.point(pointerPos);

    const clickedShapeName = e.target.name();
    if (
      !["line", "spot", "circle", "group"].includes(clickedShapeName) &&
      !isDrawing
    ) {
      setStartPos(pos);
      setCurrentPos(pos);
      setIsDrawing(true);
      setSelectedLineId(null);
    }
  };

  const handleMouseMove: HandlerType = (e) => {
    if (isDrawing) {
      const stage = stageRef.current;
      const pointerPos = stage.getPointerPosition();
      const transform = stage.getAbsoluteTransform().copy().invert();
      const pos = transform.point(pointerPos);
      setCurrentPos(pos);
    }
  };

  const handleMouseUp: HandlerType = (e) => {
    if (handlePanMouseUp(e)) return;

    if (isDrawing && startPos && currentPos) {
      addLine({
        id: `L${lines.length + 1}`,
        start: startPos,
        end: currentPos,
        spots: [],
        spotsCount: 1,
        width: 10,
        height: 5,
        rotation: 90,
      });
    }
    setIsDrawing(false);
    setStartPos(null);
    setCurrentPos(null);
  };

  const [lines, setLines] = useState<ParkingLine[]>([]);
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);
  console.log(lines);

  const generateSpotsForLine = (line: ParkingLine): ParkingSpot[] => {
    const dx = line.end.x - line.start.x;
    const dy = line.end.y - line.start.y;
    const lineLength = Math.sqrt(dx * dx + dy * dy);
    const lineAngleRad = Math.atan2(dy, dx);
    const effectiveAngleRad = lineAngleRad + (line.rotation * Math.PI) / 180;
    const spotSpacing = lineLength / line.spotsCount;

    const spots: ParkingSpot[] = [];

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

  const deleteLine = (lineId: string) => {
    setLines((prev) => prev.filter((line) => line.id !== lineId));
    setSelectedLineId(null);
  };

  const handleCircleDrag: HandleCircleDrag = (lineId, point, pos) =>
    updateLine(lineId, { [point]: pos });

  const addLine = (line: ParkingLine) => {
    line.spots = generateSpotsForLine(line);
    setLines((prev) => [...prev, line]);
  };

  return {
    lines,
    selectedLineHandling: { selectedLineId, setSelectedLineId },
    mouseHandlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
    },
    updateLine,
    handleCircleDrag,
    deleteLine,
    isDrawing,
    startPos,
    currentPos,
  };
};

export default useParkingEditor;
