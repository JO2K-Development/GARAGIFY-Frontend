'use client';
import ElevatedScreenDivider from "@/components/ElevatedScreenDivider/ElevatedScreenDivider";
import ParkingLendForm from "../ParkingLendForm/ParkingLendForm";
import { useEffect } from "react";
import MyLendingsView from "@/components/Lending/MyLendingsView/MyLendingsView";

const LendingView = () => {

  useEffect(() => {
      document.title = "Lend  a parking Spot";

    }
    , []);

  return (
    <ElevatedScreenDivider
      left={ <ParkingLendForm/> }
      right={ <MyLendingsView/> }
    />
  );
};
export default LendingView;
