"use client";
import { Group, Line, Rect, Circle } from "react-konva";
import { ParkingLine } from "../types";
import { GRID_CELL_SIZE, SHRINK_RATE } from "./useParkingEditor";
import { useRef } from "react";

const ParkingEditor = ({
  lines,
  isDrawing,
  startPos,
  currentPos,
  selectedLineId,
  setSelectedLineId,
  updateLine,
  handleMoveWholeLine,
  handleDragPoint,
}: {
  lines: ParkingLine[];
  isDrawing: boolean;
  startPos: { x: number; y: number } | null;
  currentPos: { x: number; y: number } | null;
  selectedLineId: string | null;
  setSelectedLineId: (id: string | null) => void;
  updateLine: (id: string, updates: Partial<ParkingLine>) => void;
  handleMoveWholeLine: (id: string, delta: { x: number; y: number }) => void;
  handleDragPoint: (
    id: string,
    point: "start" | "end",
    pos: { x: number; y: number }
  ) => void;
}) => {
  const ignoreMiddle = (e: any) => {
    if (e.evt.button === 1) {
      e.cancelBubble = true;
      return true;
    }
    return false;
  };

  const dragStateRef = useRef<
    Record<
      string,
      { anchor: { x: number; y: number }; initialDistance: number }
    >
  >({});

  return (
    <>
      <Rect x={0} y={0} width={1000} height={700} fill="#eee" />

      {isDrawing && startPos && currentPos && (
        <Line
          points={[startPos.x, startPos.y, currentPos.x, currentPos.y]}
          stroke="blue"
          strokeWidth={2}
          dash={[4, 4]}
        />
      )}

      {lines.map((line) => (
        <Group
          name="group"
          key={line.id}
          draggable
          onClick={(e) => {
            if (!e.target.getClassName().startsWith("Circle")) {
              setSelectedLineId(line.id);
            }
          }}
        >
          <Line
            draggable={false}
            name="line"
            points={[line.start.x, line.start.y, line.end.x, line.end.y]}
            stroke={selectedLineId === line.id ? "blue" : "gray"}
            strokeWidth={2}
          />

          {line.spots.map((spot) => (
            <Rect
              draggable={false}
              name="spot"
              key={spot.id}
              x={spot.x * GRID_CELL_SIZE}
              y={spot.y * GRID_CELL_SIZE}
              width={line.spotWidth * GRID_CELL_SIZE * SHRINK_RATE}
              height={line.spotHeight * GRID_CELL_SIZE * SHRINK_RATE}
              offsetX={(line.spotWidth * GRID_CELL_SIZE * SHRINK_RATE) / 2}
              offsetY={(line.spotHeight * GRID_CELL_SIZE * SHRINK_RATE) / 2}
              rotation={spot.rotation}
              fill="green"
            />
          ))}
          <Circle
            name="start"
            x={line.start.x}
            y={line.start.y}
            radius={8}
            fill="red"
            draggable
            onMouseDown={(e) => (e.cancelBubble = true)}
            onDragMove={(e) => {
              e.cancelBubble = true;
              const pos = e.target.position();
              handleDragPoint(line.id, "start", pos);
            }}
          />

          <Circle
            name="end"
            x={line.end.x}
            y={line.end.y}
            radius={8}
            fill="red"
            draggable
            onMouseDown={(e) => (e.cancelBubble = true)}
            onDragMove={(e) => {
              e.cancelBubble = true;
              const pos = e.target.position();
              handleDragPoint(line.id, "end", pos);
            }}
          />
        </Group>
      ))}
    </>
  );
};

export default ParkingEditor;
