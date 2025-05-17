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
import { generateSpotsOnLine } from "../../hooks/modes/parkingSpot/useParkingSpotsMode";

const { Title, Text } = Typography;

type ParkingSpotPanelProps = {
  canvas: fabric.Canvas | undefined;
  place: () => void;
};

const ParkingSpotPanel: React.FC<ParkingSpotPanelProps> = ({
  canvas,
  place,
}) => {
  const {
    selectedObject,
    parkingSpotGroups,
    editParkingSpotGroup,
    removeParkingSpotGroup,
    setSelectedObject,
  } = useCanvasContext();

  if (!canvas) return null;

  if (!selectedObject) {
    return (
      <div style={{ minWidth: 250 }}>
        <Button type="primary" onClick={place} style={{ width: "100%" }}>
          ➕ Add Parking Spot Group
        </Button>
        <Title level={5}>🅿️ Parking Spot Tools</Title>
        <Divider style={{ margin: "8px 0" }} />
        <Text type="secondary">
          Click the button above to add a parking spot group.
          <br />
          <br />
          First click sets the starting point, second click sets the ending
          point.
          <br />
          <br />
          You can then adjust the number of spots, their size, and rotation.
        </Text>
      </div>
    );
  }

  // Get the groupId from the selected object
  const groupId =
    selectedObject.get("groupId") ||
    (selectedObject.type === "activeSelection" &&
      selectedObject._objects?.[0]?.get("groupId"));

  // Find the group in our context
  const group = parkingSpotGroups.find((g) => g.id === groupId);

  if (!group) {
    return (
      <div style={{ minWidth: 250 }}>
        <Button type="primary" onClick={place} style={{ width: "100%" }}>
          ➕ Add Parking Spot Group
        </Button>
        <Title level={5}>🅿️ Parking Spot Tools</Title>
        <Divider style={{ margin: "8px 0" }} />
        <Text type="secondary">Please select a parking spot group.</Text>
      </div>
    );
  }

  const handleSpotCountChange = (value: number | null) => {
    if (!value || value < 1) return;

    // Update group in context
    editParkingSpotGroup(group.id, (prev) => {
      const updated = {
        ...prev,
        spotCount: value,
      };

      // Remove old spots
      prev.spots.forEach((s) => canvas.remove(s));

      // Generate new spots
      const newSpots = generateSpotsOnLine(updated);
      newSpots.forEach((s) => canvas.add(s));
      updated.spots = newSpots;

      return updated;
    });

    canvas.requestRenderAll();
  };

  const handleSpotAngleChange = (value: number | null) => {
    if (value === null) return;

    editParkingSpotGroup(group.id, (prev) => {
      const updated = {
        ...prev,
        spotAngle: value,
      };

      // Update angle on each spot
      updated.spots.forEach((spot) => {
        spot.set("angle", value);
      });

      return updated;
    });

    canvas.requestRenderAll();
  };

  const handleSpotSizeChange = (
    dimension: "width" | "height",
    value: number | null
  ) => {
    if (!value) return;

    editParkingSpotGroup(group.id, (prev) => {
      const updated = {
        ...prev,
        spotSize: {
          ...prev.spotSize,
          [dimension]: value,
        },
      };

      // Remove old spots
      prev.spots.forEach((s) => canvas.remove(s));

      // Generate new spots
      const newSpots = generateSpotsOnLine(updated);
      newSpots.forEach((s) => canvas.add(s));
      updated.spots = newSpots;

      return updated;
    });

    canvas.requestRenderAll();
  };

  const rotateSpots = (degrees: number) => {
    const newAngle = group.spotAngle + degrees;

    editParkingSpotGroup(group.id, (prev) => {
      const updated = {
        ...prev,
        spotAngle: newAngle,
      };

      // Update angle on each spot
      updated.spots.forEach((spot) => {
        spot.set("angle", newAngle);
      });

      return updated;
    });

    canvas.requestRenderAll();
  };

  const handleDelete = () => {
    if (!canvas || !groupId) return;

    // Remove all related objects from canvas
    canvas.getObjects().forEach((obj) => {
      if (obj.get("groupId") === groupId) {
        canvas.remove(obj);
      }
    });

    // Remove from context
    removeParkingSpotGroup(groupId);
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    setSelectedObject(null);
  };

  return (
    <div style={{ minWidth: 250 }}>
      <Title level={5}>🅿️ Parking Spot Editor</Title>
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
          <Space direction="vertical" style={{ width: "100%" }}>
            <div>
              <Text>Width:</Text>
              <InputNumber
                min={10}
                max={100}
                value={group.spotSize.width}
                onChange={(val) => handleSpotSizeChange("width", val)}
                style={{ width: 80, marginLeft: 10 }}
              />
            </div>
            <div>
              <Text>Height:</Text>
              <InputNumber
                min={20}
                max={200}
                value={group.spotSize.height}
                onChange={(val) => handleSpotSizeChange("height", val)}
                style={{ width: 80, marginLeft: 10 }}
              />
            </div>
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
