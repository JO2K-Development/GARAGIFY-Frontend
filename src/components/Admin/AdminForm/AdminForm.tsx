"use client";
import { Button, Checkbox, Flex, TimePicker } from "antd";
import { Controller } from "react-hook-form";
import labels from "@/labels.json";
import dayjs from "dayjs";
import useAdminForm, { TIME_FORMAT } from "./useAdminForm";
import ParkingView from "@/components/Parking/View/ParkingView/ParkingView";
const {
  admin_panel: {
    form: { assignToSpot, submit },
  },
} = labels;
const ParkingBorrowForm = () => {
  const {
    handleSubmit,
    onSubmit,
    formState: { errors },
  } = useAdminForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex vertical gap="large" align="center">
        <ParkingView/>
        <Button type="primary" htmlType="submit">
          {submit}
        </Button>
      </Flex>
    </form>
  );
};

export default ParkingBorrowForm;
