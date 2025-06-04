"use client";
import { ParkingMap } from "@/components/Parking/Commons/utils/types";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getParking } from "@/api/api";
import { hydrateParking } from "@/components/Parking/Commons/serialization/hydrate";
import { Dayjs } from "dayjs";

interface SelectedSpotContextType {
  selectedSpotId: string | null;
  setSelectedSpotId: (id: string | null) => void;
  disabledSpotIds: string[];
  setDisabledSpotIds: (ids: string[]) => void;
  allSpotIds: string[];
  parkingUI: ParkingMap | null;
  isLoading: boolean;
  disabledDates: Dayjs[];
  setDisabledDates: (dates: Dayjs[]) => void;

}

const SpotContext = createContext<SelectedSpotContextType>({
  selectedSpotId: null,
  setSelectedSpotId: () => {},
  disabledSpotIds: [],
  setDisabledSpotIds: () => {},
  allSpotIds: [],
  parkingUI: null,
  isLoading: false,
  disabledDates: [],
  setDisabledDates: () => {},
});

export const useSpot = () => {
  const context = useContext(SpotContext);
  if (!context)
    throw new Error("useSpot must be used within SpotProvider");
  return context;
};

export const SpotProvider = ({ children }: PropsWithChildren) => {
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [disabledSpotIds, setDisabledSpotIds] = useState<string[]>([]);
  const [disabledDates, setDisabledDates] = useState<Dayjs[]>([]);



  const { data, error, isLoading } = useQuery({
    queryKey: ["parking"],
    queryFn: () => getParking(1),
  });

  const [parkingUI, setParkingUI] = useState<ParkingMap | null>(
    null
  );

  const parkingSpots = parkingUI ? parkingUI.spotGroups.flatMap((group) =>
          group.spots.map((spot) => (spot as any).spotId)
        ) : [];
  

  useEffect(() => {
    if (data) {
      hydrateParking(data as ParkingMap).then(setParkingUI);
    }
  }, [data]);

  return (
    <SpotContext.Provider
      value={{
        selectedSpotId,
        setSelectedSpotId,
        disabledSpotIds,
        setDisabledSpotIds,
        allSpotIds: parkingSpots,
        parkingUI,
        isLoading,
        disabledDates,
        setDisabledDates,
      }}
    >
      {children}
    </SpotContext.Provider>
  );
};
