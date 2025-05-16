"use client";
import React from "react";
import { Select } from "antd";
import { useCanvasContext } from "../../context/CanvasContext";
import styles from "./ModeSelector.module.scss";

const { Option } = Select;

const ModeSelector: React.FC = () => {
  const { mode, setMode } = useCanvasContext();

  return (
    <Select
      value={mode}
      onChange={(value) => setMode(value as typeof mode)}
      className={styles.selector}
    >
      <Option value="parkingZone">🗂 Parking Zones</Option>
      <Option value="obstacles">🚧 Obstacles</Option>
      <Option value="parkingSpots">🅿️ Parking Spots</Option>
      <Option value="view">👁 View Mode</Option>
    </Select>
  );
};

export default ModeSelector;
