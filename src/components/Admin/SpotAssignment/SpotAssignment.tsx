import React from "react";
import { Select, Button, Typography, Space } from "antd";
import { useSpot } from "@/context/SpotProvider";
import { useSpotAssignment } from "./useSpotAssignment";

const { Title } = Typography;
const { Option } = Select;

const SpotAssignment = () => {
  const { selectedSpotId } = useSpot();
  const {
    owner,
    users,
    selectedUserId,
    handleChange,
    onSubmit,
    onUnassign, 
  } = useSpotAssignment();

  return (
    <div style={{ padding: "1rem", maxWidth: 400 }}>
      <Title level={4}>Selected spot owner:</Title>

      <Select
        placeholder="Select a user"
        value={selectedUserId || undefined}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: "1rem" }}
        disabled={!selectedSpotId}
        allowClear
      >
        {users.map(user => (
          <Option key={user.user_id} value={user.user_id}>
            {user.email}
          </Option>
        ))}
      </Select>

      <Space direction="horizontal" style={{ width: "100%", justifyContent: "space-between" }}>
        <Button
          type="primary"
          onClick={onSubmit}
          disabled={!selectedUserId || !selectedSpotId || owner?.user_id === selectedUserId}
          style={{ flex: 1 }}
        >
          Assign
        </Button>
        <Button
          danger
          onClick={onUnassign}
          disabled={!selectedUserId || !selectedSpotId}
          style={{ flex: 1 }}
        >
          Unassign
        </Button>
      </Space>
    </div>
  );
};

export default SpotAssignment;
