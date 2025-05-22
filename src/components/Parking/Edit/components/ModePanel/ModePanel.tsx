"use client";

import { Mode } from "@/components/Parking/Commons/utils/types";
import ObstaclePanel from "../panels/ObstaclePanel";
import ParkingSpotPanel from "../panels/ParkingSpotPanel";
import ParkingZonePanel from "../panels/ParkingZonePanel";
import { Typography } from "antd";
import { useEditContext } from "../../Context/useEditContext";
import styles from "./ModePanel.module.scss";
const { Text } = Typography;

const ModePanel = () => {
  const { mode } = useEditContext();

  let content: React.ReactNode;
  switch (mode) {
    case Mode.PARKING_SPOTS:
      content = <ParkingSpotPanel />;
      break;
    case Mode.OBSTACLES:
      content = <ObstaclePanel />;
      break;
    case Mode.PARKING_ZONE:
      content = <ParkingZonePanel />;
      break;
    case Mode.VIEW:
    default:
      content = (
        <div style={{ minWidth: 250 }}>
          <Text type="secondary">
            👁 View mode is active. Select another tool to edit the canvas.
          </Text>
        </div>
      );
      break;
  }

  return <div className={styles.panel}>{content}</div>;
};

export default ModePanel;
