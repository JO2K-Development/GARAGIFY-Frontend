"use client";
import { Group } from "react-konva";
import { ParkingLine, Point } from "../utils/types";
import { HandleCircleDrag } from "./hooks/useParkingEditor/types";
import CircleAnchor from "../components/shapes/CircleAnchor";
import ParkingSpotRect from "../components/shapes/ParkingSpotRect";
import DrawingLine from "../components/shapes/DrawingLine";
import BackgroundOverlay from "../components/shapes/BackgroundOverlay";
import ParkSpotAttachedLine from "../components/shapes/ParkSpotsAttachedLine";

const ParkingEditor = ({
  lines,
  isDrawing,
  startPos,
  currentPos,
  selectedLineId,
  setSelectedLineId,
  handleCircleDrag,
}: {
  lines: ParkingLine[];
  isDrawing: boolean;
  startPos: Point | null;
  currentPos: Point | null;
  selectedLineId: string | null;
  setSelectedLineId: (id: string | null) => void;
  handleCircleDrag: HandleCircleDrag;
}) => {
  return (
    <>
      <BackgroundOverlay />
      {isDrawing && startPos && currentPos && (
        <DrawingLine startPos={startPos} currentPos={currentPos} />
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
          <ParkSpotAttachedLine
            isSelected={selectedLineId === line.id}
            attachedPoints={line}
          />

          {line.spots.map((spot) => (
            <ParkingSpotRect key={spot.id} spot={spot} lineConfig={line} />
          ))}
          <CircleAnchor
            name="start"
            line={line}
            handleDrag={handleCircleDrag}
          />
          <CircleAnchor name="end" line={line} handleDrag={handleCircleDrag} />
        </Group>
      ))}
    </>
  );
};

export default ParkingEditor;
