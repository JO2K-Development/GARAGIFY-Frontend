"use client";

import React from "react";
import { Button, Space, Divider, Typography } from "antd";
import { useCanvasContext } from "../../context/CanvasContext";
import * as fabric from "fabric";

const { Title } = Typography;

type ObstaclePanelProps = {
  onSelect: (type: "tree" | "area") => void;
  canvas: fabric.Canvas | undefined;
};

const ObstaclePanel: React.FC<ObstaclePanelProps> = ({ onSelect, canvas }) => {
  const { selectedObject, setSelectedObject, removeObstacle } =
    useCanvasContext();

  const handleDelete = () => {
    if (!canvas || !selectedObject) return;

    const id = selectedObject.get("customId");
    if (id) removeObstacle(id);

    canvas.remove(selectedObject);
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    setSelectedObject(null);
  };

  return (
    <div style={{ minWidth: 250 }}>
      <Title level={5}>🚧 Obstacle Tools</Title>

      <Divider style={{ margin: "8px 0" }} />

      <Space direction="vertical" style={{ width: "100%" }}>
        <Button onClick={() => onSelect("tree")} block>
          🌳 Add Tree
        </Button>
        <Button onClick={() => onSelect("area")} block>
          🟦 Add Area
        </Button>
      </Space>

      {selectedObject && (
        <>
          <Divider style={{ margin: "12px 0" }} />
          <Button danger type="primary" block onClick={handleDelete}>
            Delete Obstacle
          </Button>
        </>
      )}
    </div>
  );
};

export default ObstaclePanel;
