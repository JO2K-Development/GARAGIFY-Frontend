"use client";
import { Flex } from "antd";
import useAdminForm from "./useAdminForm";
import ParkingView from "@/components/Parking/View/ParkingView/ParkingView";
const ParkingBorrowForm = () => {
  const {
  } = useAdminForm();

  return (
      <Flex vertical gap="large" align="center">
        <ParkingView/>
      </Flex>
  );
};

export default ParkingBorrowForm;
