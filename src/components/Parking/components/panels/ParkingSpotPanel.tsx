"use client";

import { useCanvasContext } from "@/components/Parking/context/CanvasContext";
import { InputNumber, Slider, Space, Typography, Button, Form } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import useParkingSpotsMode from "../../hooks/modes/parkingSpot/useParkingSpotsMode";

const { Title } = Typography;

const ParkingSpotPanel = ({ canvas }: { canvas?: fabric.Canvas }) => {
  const {
    selectedObject,
    parkingSpotGroups,
    editParkingSpotGroup,
    removeParkingSpotGroup,
  } = useCanvasContext();
  useParkingSpotsMode(canvas);
  const [groupId, setGroupId] = useState<string | null>(null);

  const group = parkingSpotGroups.find((g) => g.id === groupId);

  useEffect(() => {
    const id =
      selectedObject?.get("groupId") ??
      (selectedObject?.get("type") === "activeSelection"
        ? selectedObject._objects?.[0]?.get("groupId")
        : null);

    setGroupId(typeof id === "string" ? id : null);
  }, [selectedObject]);

  if (!group) return <Title level={5}>🅿️ Parking Spot Tool</Title>;

  const update = (partial: Partial<typeof group>) => {
    editParkingSpotGroup(group.id, (prev) => ({
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
            onClick={() => removeParkingSpotGroup(group.id)}
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
