// components/SpotAssignment.tsx
import React from "react";
import { Select, Button, Typography } from "antd";
import { useSpot } from "@/context/SpotProvider";
import { useSpotAssignment } from "./useSpotAssignment";

const { Title } = Typography;
const { Option } = Select;

type UserData = {
  userId: string;
  email: string;
};

type SpotAssignmentProps = {
  userData: Record<string, UserData[]>;
};

const SpotAssignment: React.FC<SpotAssignmentProps> = ({ userData }) => {
  const { selectedSpotId } = useSpot();
  const { usersForSpot, selectedUserId, handleChange, onSubmit } = useSpotAssignment({
    userData,
    selectedSpotId,
  });

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
        {usersForSpot.map(user => (
          <Option key={user.userId} value={user.userId}>
            {user.email}
          </Option>
        ))}
      </Select>

      <Button
        type="primary"
        onClick={onSubmit}
        disabled={!selectedUserId || !selectedSpotId}
        block
      >
        Submit
      </Button>
    </div>
  );
};

export default SpotAssignment;
