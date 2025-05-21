"use client";

import { InputNumber, Slider, Space, Typography, Button, Form } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import useParkingSpotsMode from "../../hooks/parkingSpot/useParkingSpotsMode";
import removeGroupFromCanvas from "../../hooks/parkingSpot/removeGroupFromCanvas";
import { useEditContext } from "../../Context/useEditContext";
import * as fabric from "fabric";
const { Title } = Typography;

interface ParkingSpotPanelProps {
  canvas?: fabric.Canvas;
}
const ParkingSpotPanel = ({ canvas }: ParkingSpotPanelProps) => {
  const {
    selectedObject,
    parking: { spotGroups: parkingSpotGroups },
    editSpotGroup,
    removeSpotGroup,
    setSelectedObject,
  } = useEditContext();
  useParkingSpotsMode(canvas);
  const [groupId, setGroupId] = useState<string | null>(null);

  const group = parkingSpotGroups.find((g) => g.id === groupId);

  useEffect(() => {
    const groupId =
      (selectedObject as any)?.get?.("groupId") ??
      ((selectedObject as any)?.get?.("type") === "activeSelection"
        ? (selectedObject as any)?._objects?.[0]?.get?.("groupId")
        : null);

    setGroupId(typeof groupId === "string" ? groupId : null);
  }, [selectedObject]);

  if (!group) return <Title level={5}>🅿️ Parking Spot Tool</Title>;

  const update = (partial: Partial<typeof group>) => {
    editSpotGroup(group.id, (prev) => ({
      ...prev,
      ...partial,
    }));
  };

  return (
    <div
      style={{
        padding: 16,
        background: "#fff",
        borderRadius: 6,
        minWidth: 250,
      }}
    >
      <Title level={5}>🅿️ Parking Spot Settings</Title>

      <Form layout="vertical" style={{ marginTop: 12 }}>
        <Form.Item label="Number of Spots">
          <InputNumber
            min={1}
            max={50}
            value={group.spotCount}
            onChange={(val) => val && update({ spotCount: val })}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item label="Spot Angle (°)">
          <Slider
            min={-180}
            max={180}
            value={group.spotAngle}
            onChange={(val) => update({ spotAngle: val })}
          />
        </Form.Item>

        <Form.Item label="Spot Size">
          <Space>
            <span>W:</span>
            <InputNumber
              min={10}
              max={100}
              value={group.spotSize.width}
              onChange={(val) =>
                val && update({ spotSize: { ...group.spotSize, width: val } })
              }
            />
            <span>H:</span>
            <InputNumber
              min={10}
              max={200}
              value={group.spotSize.height}
              onChange={(val) =>
                val && update({ spotSize: { ...group.spotSize, height: val } })
              }
            />
          </Space>
        </Form.Item>

        <Form.Item>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              removeGroupFromCanvas(group.id, canvas); // 🧼 immediate cleanup
              removeSpotGroup(group.id); // 🧾 update context
              setSelectedObject(null); // ⛔ clear selection
            }}
            block
          >
            Delete Group
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ParkingSpotPanel;
