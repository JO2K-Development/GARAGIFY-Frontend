"use client";
import { useState } from "react";
import { Stage, Layer, Line, Rect, Circle, Group } from "react-konva";
import { Button, Drawer, Form, InputNumber, Modal } from "antd";
export const GRID_CELL_SIZE = 10;
export const SHRINK_RATE = 1;

interface Spot {
  id: string;
  x: number;
  y: number;
  rotation: number;
  status: string;
}

interface ParkingLine {
  id: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  spots: Spot[];
  spotsCount: number;
  spotWidth: number;
  spotHeight: number;
  spotAngle: number;
}

const ParkingPicker = () => {
  const [lines, setLines] = useState<ParkingLine[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [currentPos, setCurrentPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);

  const handleMouseDown = (e: any) => {
    const pos = e.target.getStage().getPointerPosition();
    const clickedShapeName = e.target.name();
    const clickedOnEmpty = !["line", "spot", "circle"].includes(
      clickedShapeName
    );

    if (clickedOnEmpty && !isDrawing) {
      setStartPos(pos);
      setCurrentPos(pos);
      setIsDrawing(true);
      setSelectedLineId(null);
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing) return;
    const pos = e.target.getStage().getPointerPosition();
    setCurrentPos(pos);
  };

  const handleMouseUp = () => {
    if (isDrawing && startPos && currentPos) {
      const newLine: ParkingLine = {
        id: `L${lines.length + 1}`,
        start: startPos,
        end: currentPos,
        spots: [],
        spotsCount: 1,
        spotWidth: 10,
        spotHeight: 5,
        spotAngle: 90, // ✅ ← default to 90 degrees!
      };

      newLine.spots = generateSpotsForLine(newLine);
      setLines((prev) => [...prev, newLine]);
    }
    setIsDrawing(false);
    setStartPos(null);
    setCurrentPos(null);
  };

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
        x: posX / GRID_CELL_SIZE, // center coordinate
        y: posY / GRID_CELL_SIZE, // center coordinate
        rotation: (effectiveAngleRad * 180) / Math.PI,
        status: "available",
      });
    }
    return spots;
  };

  const updateLine = (lineId: string, updates: Partial<ParkingLine>) => {
    setLines((prevLines) =>
      prevLines.map((line) => {
        if (line.id === lineId) {
          const updatedLine = { ...line, ...updates };
          updatedLine.spots = generateSpotsForLine(updatedLine);
          return updatedLine;
        }
        return line;
      })
    );
  };

  const deleteLine = (lineId: string) => {
    setLines((prevLines) => prevLines.filter((line) => line.id !== lineId));
    setSelectedLineId(null);
  };

  const handleDragPoint = (
    lineId: string,
    point: "start" | "end",
    pos: { x: number; y: number }
  ) => {
    updateLine(lineId, { [point]: pos });
  };

  const handleMoveWholeLine = (
    lineId: string,
    delta: { x: number; y: number }
  ) => {
    setLines((prevLines) =>
      prevLines.map((line) => {
        if (line.id === lineId) {
          const updatedStart = {
            x: line.start.x + delta.x,
            y: line.start.y + delta.y,
          };
          const updatedEnd = {
            x: line.end.x + delta.x,
            y: line.end.y + delta.y,
          };
          const updatedLine = { ...line, start: updatedStart, end: updatedEnd };
          updatedLine.spots = generateSpotsForLine(updatedLine);
          return updatedLine;
        }
        return line;
      })
    );
  };

  return (
    <div>
      <Stage
        width={800}
        height={600}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ border: "1px solid black" }}
      >
        <Layer>
          {isDrawing && startPos && currentPos && (
            <Line
              points={[startPos.x, startPos.y, currentPos.x, currentPos.y]}
              stroke="blue"
              strokeWidth={2}
              dash={[4, 4]}
            />
          )}

          {lines.map((line) => (
            <>
              <Group
                key={line.id}
                draggable
                onDragMove={(e) => {
                  const delta = { x: e.evt.movementX, y: e.evt.movementY };
                  e.target.position({ x: 0, y: 0 }); // prevent actual visual drag → we update manually
                  handleMoveWholeLine(line.id, delta);
                }}
              >
                {/* invisible click area */}
                <Line
                  name="line"
                  points={[line.start.x, line.start.y, line.end.x, line.end.y]}
                  stroke="transparent"
                  strokeWidth={20}
                  onClick={() => setSelectedLineId(line.id)}
                />

                <Line
                  name="line"
                  points={[line.start.x, line.start.y, line.end.x, line.end.y]}
                  stroke={selectedLineId === line.id ? "blue" : "gray"}
                  strokeWidth={2}
                  onClick={(e) => {
                    e.cancelBubble = true;
                    setSelectedLineId(line.id);
                  }}
                />

                {line.spots.map((spot) => {
                  const actualWidth =
                    line.spotWidth * GRID_CELL_SIZE * SHRINK_RATE;
                  const actualHeight =
                    line.spotHeight * GRID_CELL_SIZE * SHRINK_RATE;
                  return (
                    <Rect
                      name="spot"
                      x={spot.x * GRID_CELL_SIZE}
                      y={spot.y * GRID_CELL_SIZE}
                      width={actualWidth}
                      height={actualHeight}
                      offsetX={actualWidth / 2}
                      offsetY={actualHeight / 2}
                      rotation={spot.rotation}
                      fill="green"
                      onClick={(e) => {
                        e.cancelBubble = true;
                        setSelectedLineId(line.id);
                      }}
                    />
                  );
                })}
              </Group>
              <Circle
                name="circle"
                x={line.start.x}
                y={line.start.y}
                radius={8} // ✅ increase radius
                fill="red"
                draggable
                onDragMove={(e) =>
                  handleDragPoint(line.id, "start", e.target.position())
                }
                onClick={() => setSelectedLineId(line.id)}
              />
              <Circle
                name="circle"
                x={line.end.x}
                y={line.end.y}
                radius={8} // ✅ increase radius
                fill="red"
                draggable
                onDragMove={(e) =>
                  handleDragPoint(line.id, "end", e.target.position())
                }
                onClick={() => setSelectedLineId(line.id)}
              />
            </>
          ))}
        </Layer>
      </Stage>

      <Modal
        title={`Config for ${selectedLineId}`}
        open={!!selectedLineId}
        onCancel={() => setSelectedLineId(null)}
        footer={[
          <Button
            key="delete"
            danger
            onClick={() => deleteLine(selectedLineId!)}
          >
            Delete Line
          </Button>,
          <Button key="close" onClick={() => setSelectedLineId(null)}>
            Close
          </Button>,
        ]}
      >
        {lines
          .filter((line) => line.id === selectedLineId)
          .map((line) => (
            <Form layout="vertical" key={line.id}>
              <Form.Item label="Spots">
                <InputNumber
                  min={1}
                  value={line.spotsCount}
                  onChange={(value) =>
                    updateLine(line.id, { spotsCount: Number(value) })
                  }
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Form.Item label="Width">
                <InputNumber
                  min={1}
                  value={line.spotWidth}
                  onChange={(value) =>
                    updateLine(line.id, { spotWidth: Number(value) })
                  }
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Form.Item label="Height">
                <InputNumber
                  min={1}
                  value={line.spotHeight}
                  onChange={(value) =>
                    updateLine(line.id, { spotHeight: Number(value) })
                  }
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Form.Item label="Angle">
                <InputNumber
                  min={0}
                  max={360}
                  value={line.spotAngle}
                  onChange={(value) =>
                    updateLine(line.id, { spotAngle: Number(value) })
                  }
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Form>
          ))}
      </Modal>

      <pre>{JSON.stringify(lines, null, 2)}</pre>
    </div>
  );
};

export default ParkingPicker;
