"use client";

import { Button, Space, Divider, Typography } from "antd";
import * as fabric from "fabric";
import { ObstacleType } from "../../../Commons/types";
import { useEditContext } from "../../Context/useEditContext";

const { Title } = Typography;

interface ObstaclePanelProps {
  onSelect: (type: ObstacleType) => void;
  canvas?: fabric.Canvas;
}

const ObstaclePanel = ({ onSelect, canvas }: ObstaclePanelProps) => {
  const { selectedObject, setSelectedObject, removeObstacle } =
    useEditContext();

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
        <Button onClick={() => onSelect(ObstacleType.TREE)} block>
          🌳 Add Tree
        </Button>
        <Button onClick={() => onSelect(ObstacleType.AREA)} block>
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
