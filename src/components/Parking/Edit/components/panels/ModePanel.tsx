"use client";

import { Mode } from "@/components/Parking/Commons/types";
import ObstaclePanel from "./ObstaclePanel";
import ParkingSpotPanel from "./ParkingSpotPanel";
import ParkingZonePanel from "./ParkingZonePanel";
import * as fabric from "fabric";
import { Typography } from "antd";
import useParkingZoneMode from "../../hooks/parkingZone/useParkingZoneMode";
import { useEditContext } from "../../Context/useEditContext";
import useObstacleMode from "../../hooks/obstacle/useObstacleMode";

const { Text } = Typography;

interface ModePanelProps {
  canvas?: fabric.Canvas;
}

const ModePanel = ({ canvas }: ModePanelProps) => {
  const { mode } = useEditContext();

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
