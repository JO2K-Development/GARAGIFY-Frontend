"use client";
import { useState, useEffect } from "react";
import { ParkingViewProvider } from "../ParkingViewContext";
import parking from "../mockParking.json";
import ParkingWrapper from "../../Commons/components/ParkingWrapper/ParkingWrapper";
import ViewCanvas from "../ViewCanvas/ViewCanvas";
import { hydrateParking } from "../../Commons/serialization/hydrate";
import { ParkingMap } from "../../Commons/utils/types";

const ParkingView = () => {
  const [hydratedParking, setHydratedParking] = useState<ParkingMap>();

  useEffect(() => {
    hydrateParking(parking as unknown as ParkingMap).then(setHydratedParking);
  }, []);

  if (!hydratedParking) {
    return null;
  }
  return (
    <ParkingViewProvider parking={hydratedParking}>
      <ParkingWrapper>
        <ViewCanvas />
      </ParkingWrapper>
    </ParkingViewProvider>
  );
};

export default ParkingView;
