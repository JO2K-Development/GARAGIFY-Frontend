"use client";

import React from "react";
import { Button, Space, Tooltip } from "antd";
import { ZoomInOutlined, ZoomOutOutlined } from "@ant-design/icons";
import { useCanvasZoom } from "../hooks/useCanvasZoom";
import { Canvas } from "fabric";

type Props = {
  canvas: Canvas;
};

const ZoomControls: React.FC<Props> = ({ canvas }) => {
  const { onZoomIn, onZoomOut } = useCanvasZoom(canvas);

  return (
    <Space.Compact>
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
