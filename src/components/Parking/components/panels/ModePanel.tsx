"use client";

import { Canvas } from "fabric";
import { Mode, useCanvasContext } from "../../context/CanvasContext";
import ObstaclePanel from "./ObstaclePanel";
import ParkingSpotPanel from "./ParkingSpotPanel";
import ParkingZonePanel from "./ParkingZonePanel";

import useCanvasPanning from "../../hooks/canvas/useCanvasPanning";
import useParkingZoneMode from "../../hooks/modes/parkingZone/useParkingZoneMode";
import useParkingSpotsMode from "../../hooks/modes/parkingSpot/useParkingSpotsMode";
import useObstacleMode from "../../hooks/modes/obstacle/useObstacleMode";
import { Typography } from "antd";

const { Text } = Typography;

interface ModePanelProps {
  canvas: Canvas;
}

const ModePanel: React.FC<ModePanelProps> = ({ canvas }) => {
  const { mode } = useCanvasContext();

  useCanvasPanning(canvas);
  useParkingZoneMode(canvas);
  const { setCurrentType } = useObstacleMode(canvas);

  switch (mode) {
    case Mode.PARKING_SPOTS:
      return <ParkingSpotPanel canvas={canvas} />;
    case Mode.OBSTACLES:
      return <ObstaclePanel canvas={canvas} onSelect={setCurrentType} />;
    case Mode.PARKING_ZONE:
      return <ParkingZonePanel canvas={canvas} />;
    case Mode.VIEW:
    default:
      return (
        <div style={{ minWidth: 250 }}>
          <Text type="secondary">
            👁 View mode is active. Select another tool to edit the canvas.
          </Text>
        </div>
      );
  }
};

export default ModePanel;
