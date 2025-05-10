"use client";
import { useRef, useState } from "react";
import { Stage, Layer } from "react-konva";
import { Button, Modal, Form, InputNumber, Space } from "antd";
import useParkingEditor from "../Parking/utils/Editor/useParkingEditor";
import ParkingEditor from "../Parking/utils/Editor/ParkingEditor";

const ParkingPickerTools = () => {
  const stageRef = useRef<any>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPos, setLastPanPos] = useState<{ x: number; y: number } | null>(
    null
  );

  const {
    lines,
    selectedLineId,
    setSelectedLineId,
    updateLine,
    handleMoveWholeLine,
    handleDragPoint,
    deleteLine,
    addLine,
  } = useParkingEditor();

  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [currentPos, setCurrentPos] = useState<{ x: number; y: number } | null>(
    null
  );

  const handleZoom = (dir: "in" | "out") => {
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const scaleBy = 1.2;
    const mousePointTo = {
      x: stage.width() / 2 / oldScale - stage.x() / oldScale,
      y: stage.height() / 2 / oldScale - stage.y() / oldScale,
    };

    const newScale = dir === "in" ? oldScale * scaleBy : oldScale / scaleBy;
    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: -(mousePointTo.x - stage.width() / 2 / newScale) * newScale,
      y: -(mousePointTo.y - stage.height() / 2 / newScale) * newScale,
    };

    stage.position(newPos);
    stage.batchDraw();
  };

  const handleMouseDown = (e: any) => {
    const stage = stageRef.current;
    if (e.evt.button === 1) {
      setIsPanning(true);
      setLastPanPos({ x: e.evt.clientX, y: e.evt.clientY });
      return;
    }

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

  const handleMouseMove = (e: any) => {
    const stage = stageRef.current;
    if (isPanning && lastPanPos) {
      const dx = e.evt.clientX - lastPanPos.x;
      const dy = e.evt.clientY - lastPanPos.y;
      const pos = stage.position();
      stage.position({ x: pos.x + dx, y: pos.y + dy });
      stage.batchDraw();
      setLastPanPos({ x: e.evt.clientX, y: e.evt.clientY });
      return;
    }

    if (isDrawing) {
      const pointerPos = stage.getPointerPosition();
      const transform = stage.getAbsoluteTransform().copy().invert();
      const pos = transform.point(pointerPos);
      setCurrentPos(pos);
    }
  };

  const handleMouseUp = (e: any) => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }

    if (isDrawing && startPos && currentPos) {
      addLine({
        id: `L${lines.length + 1}`,
        start: startPos,
        end: currentPos,
        spots: [],
        spotsCount: 1,
        spotWidth: 10,
        spotHeight: 5,
        spotAngle: 90,
      });
    }
    setIsDrawing(false);
    setStartPos(null);
    setCurrentPos(null);
  };

  return (
    <div
      style={{
        position: "relative",
        width: 1000,
        height: 700,
        border: "1px solid black",
      }}
    >
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 1 }}>
        <Space>
          <Button onClick={() => handleZoom("in")}>Zoom In</Button>
          <Button onClick={() => handleZoom("out")}>Zoom Out</Button>
        </Space>
      </div>

      <Stage
        ref={stageRef}
        width={1000}
        height={700}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          <ParkingEditor
            lines={lines}
            isDrawing={isDrawing}
            startPos={startPos}
            currentPos={currentPos}
            selectedLineId={selectedLineId}
            setSelectedLineId={setSelectedLineId}
            updateLine={updateLine}
            handleMoveWholeLine={handleMoveWholeLine}
            handleDragPoint={handleDragPoint}
          />
        </Layer>
      </Stage>

      <Modal
        open={!!selectedLineId}
        title={`Config for ${selectedLineId}`}
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
            <Form key={line.id} layout="vertical">
              <Form.Item label="Spots">
                <InputNumber
                  value={line.spotsCount}
                  onChange={(v) => updateLine(line.id, { spotsCount: v })}
                />
              </Form.Item>
              <Form.Item label="Width">
                <InputNumber
                  value={line.spotWidth}
                  onChange={(v) => updateLine(line.id, { spotWidth: v })}
                />
              </Form.Item>
              <Form.Item label="Height">
                <InputNumber
                  value={line.spotHeight}
                  onChange={(v) => updateLine(line.id, { spotHeight: v })}
                />
              </Form.Item>
              <Form.Item label="Angle">
                <InputNumber
                  value={line.spotAngle}
                  onChange={(v) => updateLine(line.id, { spotAngle: v })}
                />
              </Form.Item>
            </Form>
          ))}
      </Modal>
    </div>
  );
};

export default ParkingPickerTools;
