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

const ParkingView = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["parking"],
    queryFn: () => getParking(1),
  });

  const [hydratedParking, setHydratedParking] = useState<ParkingMap | null>(
    null
  );

  useEffect(() => {
    if (data) {
      hydrateParking(data as ParkingMap).then(setHydratedParking);
    }
  }, [data]);

  if (isLoading || !hydratedParking) {
    return <LoadingOverlay />;
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
