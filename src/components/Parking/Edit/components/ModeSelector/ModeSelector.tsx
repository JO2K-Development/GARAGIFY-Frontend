"use client";
import React from "react";
import { Select } from "antd";
import styles from "./ModeSelector.module.scss";
import { Mode } from "../../../Commons/utils/types";
import { useEditContext } from "../../Context/useEditContext";

const ModeSelector: React.FC = () => {
  const { mode, setMode } = useEditContext();

  return (
    <Select
      value={mode}
      onChange={(value) => setMode(value)}
      className={styles.selector}
    >
      <Select.Option value={Mode.PARKING_ZONE}>🗂 Parking Zones</Select.Option>
      <Select.Option value={Mode.OBSTACLES}>🚧 Obstacles</Select.Option>
      <Select.Option value={Mode.PARKING_SPOTS}>🅿️ Parking Spots</Select.Option>
    </Select>
  );
};

export default ModeSelector;
