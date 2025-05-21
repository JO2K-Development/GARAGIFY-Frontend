"use client";
import { useState, useEffect } from "react";
import ParkingCanvas from "../../Commons/components/ParkingCanvas/ParkingCanvas";
import { ParkingViewProvider } from "../ParkingViewContext";
import { hydrateParking } from "../hydrateParking";
import parking from "../mockParking.json";

const ParkingView = () => {
  const [hydratedParking, setHydratedParking] = useState<any>(null);

  console.log(hydratedParking);
  useEffect(() => {
    hydrateParking(parking as any).then(setHydratedParking);
  }, []);

  if (!hydratedParking) return <div>Loading...</div>;

  return (
    <ParkingViewProvider parking={hydratedParking}>
      <ParkingCanvas viewMode />
    </ParkingViewProvider>
  );
};

export default ParkingView;
