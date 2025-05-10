import { Button, Space } from "antd";
import { Stage, Layer } from "react-konva";
import ParkingEditor from "./ParkingEditor";
import ParkingLineConfigModal from "./ParkingLineConfigModal";
import useStageTransform from "./hooks/useStageTransform";
import useParkingEditor from "./hooks/useParkingEditor/useParkingEditor";

const ParkingEditorWrapper = () => {
  const { stageRef, handleZoom, ...handlePanProps } = useStageTransform();

  const {
    lines,
    selectedLineId,
    setSelectedLineId,
    updateLine,
    deleteLine,
    handleCircleDrag,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    isDrawing,
    startPos,
    currentPos,
  } = useParkingEditor({
    ...handlePanProps,
    stageRef,
  });

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
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        <Layer>
          <ParkingEditor
            selectedLineId={selectedLineId}
            setSelectedLineId={setSelectedLineId}
            handleCircleDrag={handleCircleDrag}
            isDrawing={isDrawing}
            startPos={startPos}
            currentPos={currentPos}
            lines={lines}
          />
        </Layer>
      </Stage>

      <ParkingLineConfigModal
        selectedLineId={selectedLineId}
        setSelectedLineId={setSelectedLineId}
        lines={lines}
        updateLine={updateLine}
        deleteLine={deleteLine}
      />
    </div>
  );
};

export default ParkingEditorWrapper;
