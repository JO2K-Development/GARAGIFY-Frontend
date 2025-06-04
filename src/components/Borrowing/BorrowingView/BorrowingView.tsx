"use client";
import ElevatedScreenDivider from "@/components/ElevatedScreenDivider/ElevatedScreenDivider";
import ParkingBorrowForm from "../ParkingBorrowForm/ParkingBorrowForm";
import MyBorrowingsView from "../MyBorrowingsView/MyBorrowingsView";
import { useEffect } from "react";

const BorrowingView = () => {
  useEffect(() => {
      document.title = "Borrow a parking Spot";

    }
    , []);

  return (
    <ElevatedScreenDivider
      left={ <ParkingBorrowForm/> }
      right={ <MyBorrowingsView/> }
    />
  );
};
export default BorrowingView;
