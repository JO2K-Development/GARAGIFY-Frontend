"use client";

import { Button, Divider, Typography } from "antd";
import { useEditContext } from "../../Context/useEditContext";
import { useCanvas } from "@/components/Parking/Commons/context/CanvasContext";

const { Title, Text } = Typography;

const ParkingZonePanel = () => {
  const { canvas } = useCanvas();
  const { selectedObject, setSelectedObject, removeZone } = useEditContext();

  const handleDelete = () => {
    if (!canvas || !selectedObject) return;

    const id = selectedObject.get("customId");
    if (id) removeZone(id);

    canvas.remove(selectedObject);
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    setSelectedObject(null);
  };

  return (
    <div style={{ minWidth: 250 }}>
      <Title level={5}>🗂 Parking Zone Tools</Title>
      <Divider style={{ margin: "8px 0" }} />

      {selectedObject ? (
        <>
          <Text>Zone selected. You can delete it below.</Text>
          <Divider style={{ margin: "12px 0" }} />
          <Button danger type="primary" block onClick={handleDelete}>
            Delete Zone
          </Button>
        </>
      ) : (
        <Text type="secondary">
          Select a parking zone on the canvas to view options.
        </Text>
      )}
    </div>
  );
};

export default ParkingZonePanel;
