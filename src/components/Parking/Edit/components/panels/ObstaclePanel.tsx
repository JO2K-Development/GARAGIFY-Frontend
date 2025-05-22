"use client";

import { Button, Space, Divider, Typography } from "antd";
import { ObstacleType } from "../../../Commons/types";
import { useEditContext } from "../../Context/useEditContext";
import { useCanvas } from "@/components/Parking/Commons/context/CanvasContext";
import useObstacleMode from "../../hooks/obstacle/useObstacleMode";

const { Title } = Typography;

const ObstaclePanel = () => {
  const { canvas } = useCanvas();
  const { setCurrentType } = useObstacleMode();

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
        <Button onClick={() => setCurrentType(ObstacleType.TREE)} block>
          🌳 Add Tree
        </Button>
        <Button onClick={() => setCurrentType(ObstacleType.AREA)} block>
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
