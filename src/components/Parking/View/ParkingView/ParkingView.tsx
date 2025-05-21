"use client";
import { useState, useEffect } from "react";
import ParkingCanvas from "../../Commons/components/ParkingCanvas/ParkingCanvas";
import { ParkingViewProvider } from "../ParkingViewContext";
import { hydrateParking } from "../hydrateParking";
import parking from "../mockParking.json";

const ParkingView = () => {
  const [hydratedParking, setHydratedParking] = useState<any>(null);

  useEffect(() => {
    hydrateParking(parking as any).then(setHydratedParking);
  }, []);

  return (
    <ParkingViewProvider parking={hydratedParking}>
      <ParkingCanvas viewMode />
    </ParkingViewProvider>
  );
};

export default ParkingView;
