"use client";
import React from "react";
import { Button, InputNumber, Divider, Slider, Space, Typography, Form } from "antd";
import { DeleteOutlined, RotateLeftOutlined, RotateRightOutlined } from "@ant-design/icons";
import { useCanvasContext } from "../context/CanvasContext";

const { Title } = Typography;

const ParkingSpotPanel = () => {
  const { selectedObject, parkingSpotGroups, editParkingSpotGroup, removeParkingSpotGroup } = useCanvasContext();

  if (!selectedObject) return null;

  const groupId = selectedObject.get("groupId") || 
                  (selectedObject.type === "activeSelection" && 
                   selectedObject._objects && 
                   selectedObject._objects[0]?.get("groupId"));
  
  if (!groupId) return null;

  const group = parkingSpotGroups.find((g) => g.id === groupId);
  if (!group) return null;

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
    if (!groupId) return;
    removeParkingSpotGroup(groupId);
  };

  return (
    <div style={{ padding: 12, background: "#fff", borderRadius: 4, minWidth: 250 }}>
      <Title level={5}>🅿️ Parking Spot Settings</Title>

      <Form layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item label="Number of Spots">
          <InputNumber
            min={1}
            max={20}
            value={group.spotCount}
            onChange={handleSpotCountChange}
            style={{ width: '100%' }}
          />
        </Form.Item>
        
        <Divider style={{ margin: "12px 0" }} />
        
        <Form.Item label="Spot Size">
          <Space style={{ width: '100%' }}>
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
          <Space direction="vertical" style={{ width: '100%' }}>
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
          style={{ width: '100%' }}
        >
          Delete Parking Group
        </Button>
      </Form>
    </div>
  );
};

export default ParkingSpotPanel;