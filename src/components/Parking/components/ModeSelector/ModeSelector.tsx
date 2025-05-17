"use client";
import React from "react";
import { Select } from "antd";
import { Mode, useCanvasContext } from "../../context/CanvasContext";
import styles from "./ModeSelector.module.scss";

const ModeSelector: React.FC = () => {
  const { mode, setMode } = useCanvasContext();

  return (
    <Select
      value={mode}
      onChange={(value) => setMode(value)}
      className={styles.selector}
    >
      <Select.Option value={Mode.PARKING_ZONE}>🗂 Parking Zones</Select.Option>
      <Select.Option value={Mode.OBSTACLES}>🚧 Obstacles</Select.Option>
      <Select.Option value={Mode.PARKING_SPOTS}>🅿️ Parking Spots</Select.Option>
      <Select.Option value={Mode.VIEW}>👁 View</Select.Option>
    </Select>
  );
};

export default ModeSelector;
