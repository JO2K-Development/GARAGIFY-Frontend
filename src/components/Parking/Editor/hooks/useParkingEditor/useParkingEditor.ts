// useParkingEditor.ts
import { useState } from "react";
import {
  ParkingLine,
  Point,
  ParkingSpot,
  HandlerType,
} from "../../../utils/types";
import { HandleCircleDrag } from "./types";
import { ParkingSchemaDefaults } from "@/components/Parking/utils/constants";

interface ParkingEditorProps {
  handlePanMouseDown: HandlerType;
  handlePanMouseUp: HandlerType;
  stageRef: React.RefObject<any>;
}
const useParkingEditor = ({
  handlePanMouseDown,
  handlePanMouseUp,
  stageRef,
}: ParkingEditorProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<Point | null>(null);
  const [currentPos, setCurrentPos] = useState<Point | null>(null);
  const [lines, setLines] = useState<ParkingLine[]>([]);
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);

  const composeHandlers =
    (...handlers: HandlerType[]) =>
    (e: any) => {
      for (const handler of handlers) if (handler(e)) return;
    };

  const handleMouseDown = composeHandlers(handlePanMouseDown, (e) => {
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
      return true;
    }
  });

  const handleMouseMove: HandlerType = (e) => {
    if (isDrawing) {
      const stage = stageRef.current;
      const pointerPos = stage.getPointerPosition();
      const transform = stage.getAbsoluteTransform().copy().invert();
      const pos = transform.point(pointerPos);
      setCurrentPos(pos);
    }
  };

  const handleMouseUp = composeHandlers(handlePanMouseUp, (e) => {
    if (isDrawing && startPos && currentPos) {
      addLine({
        id: `L${lines.length + 1}`,
        start: startPos,
        end: currentPos,
        spots: [],
        ...ParkingSchemaDefaults.parkingSpotCreator,
      });
    }
    setIsDrawing(false);
    setStartPos(null);
    setCurrentPos(null);
  });

  const generateSpotsForLine = (line: ParkingLine): ParkingSpot[] => {
    const dx = line.end.x - line.start.x;
    const dy = line.end.y - line.start.y;
    const lineLength = Math.sqrt(dx * dx + dy * dy);
    const lineAngleRad = Math.atan2(dy, dx);
    const effectiveAngleRad = lineAngleRad + (line.rotation * Math.PI) / 180;
    const spotSpacing = lineLength / line.spotsCount;

    return Array.from({ length: line.spotsCount }, (_, i) => ({
      id: `S${line.id}-${i + 1}`,
      x: line.start.x + Math.cos(lineAngleRad) * (i + 0.5) * spotSpacing,
      y: line.start.y + Math.sin(lineAngleRad) * (i + 0.5) * spotSpacing,
      rotation: (effectiveAngleRad * 180) / Math.PI,
      status: "available",
    }));
  };

  const updateLine = (lineId: string, updates: Partial<ParkingLine>) => {
    setLines((prev) =>
      prev.map((line) =>
        line.id === lineId
          ? {
              ...line,
              ...updates,
              spots: generateSpotsForLine({ ...line, ...updates }),
            }
          : line
      )
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
    selectedLineId,
    setSelectedLineId,
    updateLine,
    deleteLine,
    handleCircleDrag,
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp,
    isDrawing,
    startPos,
    currentPos,
  };
};

export default useParkingEditor;
