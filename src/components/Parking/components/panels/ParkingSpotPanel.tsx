"use client";

import React from "react";
import {
  Button,
  InputNumber,
  Divider,
  Slider,
  Space,
  Typography,
  Form,
} from "antd";
import {
  DeleteOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
} from "@ant-design/icons";
import * as fabric from "fabric";
import { useCanvasContext } from "../../context/CanvasContext";

const { Title, Text } = Typography;

type ParkingSpotPanelProps = {
  canvas: fabric.Canvas | undefined;
};

const ParkingSpotPanel: React.FC<ParkingSpotPanelProps> = ({ canvas }) => {
  const {
    selectedObject,
    parkingSpotGroups,
    editParkingSpotGroup,
    removeParkingSpotGroup,
    setSelectedObject,
  } = useCanvasContext();

  if (!selectedObject) {
    return (
      <div style={{ minWidth: 250 }}>
        <Title level={5}>🅿️ Parking Spot Tools</Title>
        <Divider style={{ margin: "8px 0" }} />
        <Text type="secondary">
          Select a parking spot group on the canvas to edit it.
        </Text>
      </div>
    );
  }

  const groupId =
    selectedObject.get("groupId") ||
    (selectedObject.type === "activeSelection" &&
      selectedObject._objects?.[0]?.get("groupId"));

  const group = parkingSpotGroups.find((g) => g.id === groupId);

  if (!group) {
    return (
      <div style={{ minWidth: 250 }}>
        <Title level={5}>🅿️ Parking Spot Tools</Title>
        <Divider style={{ margin: "8px 0" }} />
        <Text type="secondary">Invalid selection.</Text>
      </div>
    );
  }

  const handleSpotCountChange = (value: number | null) => {
    if (!value) return;
    editParkingSpotGroup(group.id, (prev) => ({
      ...prev,
      spotCount: value,
    }));
  };

  const handleSpotAngleChange = (value: number | null) => {
    if (value === null) return;
    editParkingSpotGroup(group.id, (prev) => ({
      ...prev,
      spotAngle: value,
    }));
  };

  const handleSpotSizeChange = (
    dimension: "width" | "height",
    value: number | null
  ) => {
    if (!value) return;
    editParkingSpotGroup(group.id, (prev) => ({
      ...prev,
      spotSize: {
        ...prev.spotSize,
        [dimension]: value,
      },
    }));
  };

  const rotateSpots = (degrees: number) => {
    editParkingSpotGroup(group.id, (prev) => ({
      ...prev,
      spotAngle: prev.spotAngle + degrees,
    }));
  };

  const handleDelete = () => {
    if (!canvas || !groupId) return;

    canvas.getObjects().forEach((obj) => {
      if (obj.get("groupId") === groupId) {
        canvas.remove(obj);
      }
    });

    removeParkingSpotGroup(groupId);
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    setSelectedObject(null);
  };

  return (
    <div style={{ minWidth: 250 }}>
      <Title level={5}>🅿️ Parking Spot Tools</Title>
      <Divider style={{ margin: "8px 0" }} />

      <Form layout="vertical">
        <Form.Item label="Number of Spots">
          <InputNumber
            min={1}
            max={20}
            value={group.spotCount}
            onChange={handleSpotCountChange}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Divider style={{ margin: "12px 0" }} />

        <Form.Item label="Spot Size">
          <Space style={{ width: "100%" }}>
            <span>Width:</span>
            <InputNumber
              min={10}
              max={100}
              value={group.spotSize.width}
              onChange={(val) => handleSpotSizeChange("width", val)}
            />
            <span>Height:</span>
            <InputNumber
              min={20}
              max={200}
              value={group.spotSize.height}
              onChange={(val) => handleSpotSizeChange("height", val)}
            />
          </Space>
        </Form.Item>

        <Divider style={{ margin: "12px 0" }} />

        <Form.Item label="Rotation">
          <Space direction="vertical" style={{ width: "100%" }}>
            <Slider
              min={-180}
              max={180}
              value={group.spotAngle}
              onChange={handleSpotAngleChange}
            />
            <Space>
              <InputNumber
                min={-180}
                max={180}
                value={group.spotAngle}
                onChange={handleSpotAngleChange}
                style={{ width: 80 }}
              />
              <Button
                icon={<RotateLeftOutlined />}
                onClick={() => rotateSpots(-15)}
              />
              <Button
                icon={<RotateRightOutlined />}
                onClick={() => rotateSpots(15)}
              />
            </Space>
          </Space>
        </Form.Item>

        <Divider style={{ margin: "12px 0" }} />

        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          onClick={handleDelete}
          style={{ width: "100%" }}
        >
          Delete Parking Group
        </Button>
      </Form>
    </div>
  );
};

export default ParkingSpotPanel;
