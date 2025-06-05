"use client";
import { Button, Space, Tooltip } from "antd";
import { ZoomInOutlined, ZoomOutOutlined } from "@ant-design/icons";
import useCanvasZoom from "./useZoomControls";
import styles from "./ZoomControls.module.scss";

const ZoomControls = () => {
  const { onZoomIn, onZoomOut } = useCanvasZoom();

  return (
    <Space.Compact className={styles.controls}>
      <Tooltip title="Zoom In">
        <Button size="large" icon={<ZoomInOutlined />} onClick={onZoomIn} />
      </Tooltip>
      <Tooltip title="Zoom Out">
        <Button size="large" icon={<ZoomOutOutlined />} onClick={onZoomOut} />
      </Tooltip>
    </Space.Compact>
  );
};

export default ZoomControls;
