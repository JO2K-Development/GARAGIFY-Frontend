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
    selectedLineHandling,
    updateLine,
    deleteLine,
    handleCircleDrag,
    mouseHandlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
    },
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
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          <ParkingEditor
            selectedLineId={selectedLineHandling.selectedLineId}
            setSelectedLineId={selectedLineHandling.setSelectedLineId}
            handleCircleDrag={handleCircleDrag}
            isDrawing={isDrawing}
            startPos={startPos}
            currentPos={currentPos}
            lines={lines}
          />
        </Layer>
      </Stage>

      <ParkingLineConfigModal
        {...selectedLineHandling}
        lines={lines}
        updateLine={updateLine}
        deleteLine={deleteLine}
      />
    </div>
  );
};

export default ParkingEditorWrapper;
