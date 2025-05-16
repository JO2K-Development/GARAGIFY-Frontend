"use client";

import React from "react";
import { Button, Space, Tooltip } from "antd";
import { ZoomInOutlined, ZoomOutOutlined } from "@ant-design/icons";

type Props = {
  onZoomIn: () => void;
  onZoomOut: () => void;
};

const ZoomControls: React.FC<Props> = ({ onZoomIn, onZoomOut }) => {
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
