"use client";
import { useState, useEffect } from "react";
import { ParkingViewProvider } from "../ParkingViewContext";
import { hydrateParking } from "../hydration/hydrateParking";
import parking from "../mockParking.json";
import ParkingWrapper from "../../Commons/components/ParkingWrapper/ParkingWrapper";
import ViewCanvas from "../ViewCanvas/ViewCanvas";

const ParkingView = () => {
  const [hydratedParking, setHydratedParking] = useState<any>(null);

  useEffect(() => {
    hydrateParking(parking as any).then(setHydratedParking);
  }, []);

  return (
    <ParkingViewProvider parking={hydratedParking}>
      <ParkingWrapper>
        <ViewCanvas />
      </ParkingWrapper>
    </ParkingViewProvider>
  );
};

export default ParkingView;
