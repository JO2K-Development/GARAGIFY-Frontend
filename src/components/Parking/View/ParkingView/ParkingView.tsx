"use client";
import { useState, useEffect } from "react";
import { ParkingViewProvider } from "../ParkingViewContext";
import ParkingWrapper from "../../Commons/components/ParkingWrapper/ParkingWrapper";
import ViewCanvas from "../ViewCanvas/ViewCanvas";
import { hydrateParking } from "../../Commons/serialization/hydrate";
import { ParkingMap } from "../../Commons/utils/types";
import { useQuery } from "@tanstack/react-query";
import { getParking } from "@/api/api";
import LoadingOverlay from "@/components/LoadingOverlay/LoadingOverlay";
import { useSpot } from "@/context/SpotProvider";

const ParkingView = () => {
  const { isLoading, parkingUI } = useSpot();

  if (isLoading || !parkingUI) {
    return <LoadingOverlay />;
  }
  return (
    <ParkingViewProvider parking={parkingUI}>
      <ParkingWrapper>
        <ViewCanvas />
      </ParkingWrapper>
    </ParkingViewProvider>
  );
};

export default ParkingView;
