import { Button, Space } from "antd";

type ObstaclePanelProps = {
  onSelect: (type: "tree" | "area") => void;
};

const ObstaclePanel = ({ onSelect }: ObstaclePanelProps) => (
  <Space direction="vertical">
    <p>Add Object</p>
    <Button onClick={() => onSelect("tree")}>🌳 Tree</Button>
    <Button onClick={() => onSelect("area")}>🟦 Area</Button>
  </Space>
);

export default ObstaclePanel;
