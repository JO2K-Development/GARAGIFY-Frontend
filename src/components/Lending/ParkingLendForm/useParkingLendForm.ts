export const TIME_FORMAT = "HH:mm";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSpot } from "@/context/SpotProvider";
import { useEffect, useState } from "react";
import {
  getLendSpots,
  getLendTimeRanges,
  lendSpot,
  TimeRange,
} from "@/api/parking";

const useParkingLendForm = () => {
  const { selectedSpotId, setDisabledSpotIds, allSpotIds } = useSpot();

  const disabledDates = [
    dayjs("2025-05-12"),
    dayjs("2025-05-20"),
    dayjs("2025-06-01"),
  ];

  useEffect(() => {
    // to jest endpoint
    getLendTimeRanges(1, {
      untilWhen: new Date(Date.now() + 1000 * 60 * 60 * 24 * 50), // 50 days from now
    });
    // TODO przemapować żeby wygladało jak, endpoint zwraca kiedy można pożyczyć, a musimy wiedzieć kiedy nie można (konkretne dni, nie przedziały)
    //   const disabledDates = [
    //   dayjs("2025-05-12"),
    //   dayjs("2025-05-20"),
    //   dayjs("2025-06-01"),
    // ];

    

    // TODO można prznieść do twojego contextu żeby view mógł tego użyć
    //np:
    // setDisabledSpotIds([
    //   // "82d3d324-6e40-4e46-b3b3-3acd0dd0c359",
    //   // "71be7732-7630-4166-b29a-29ca97a02be0",
    //   "7147ef24-0257-4a07-8a47-67220b1a53ef",
    //   "0e0af45a-badb-475f-9910-2a26fa33155b",
    //   "01dbeea6-2c6f-4fd9-abd7-b3d268b1db54",
    //   "9f23340e-ce6a-4831-b2b4-a669ca66ee99",
    //   "770e3cd4-1c9b-44fb-825d-bcff9f4113f7",
    //   "7454eef6-d1c7-4bb2-8a84-a5a5ad083e65",
    //   "70ebeb06-7310-4922-b65a-3c55c75079cf",
    //   "9eaf95f6-15bc-4905-a000-e87577b4e79d",
    //   "0472d305-1178-4d23-9260-ff1f0c765ee5",
    //   "4bec3f40-a34b-45be-ba87-a9210062a398",
    //   "97466e4c-cca6-474e-b0d6-f60be9390ade",
    //   "7f9c5227-adf5-44a9-aabb-bbdcfcfdd48b",
    //   "968ce770-6567-4e1e-b844-fcfec99d0e00",
    //   "118a913d-5779-4128-bafb-ca018e07977b",
    //   "28d43baf-9be9-4b7c-9b86-b1fab5adae26",
    //   "8919f27c-6228-4ac4-9fbf-83c467a9f482",
    //   "1bcab04a-8e27-432f-ad7c-c1c156c7fd5f",
    // ]);
  }, []);
  
  const [timeRange, setTimeRange] = useState<{ from: Date; until: Date } | null>(null);

  // Prepare the query, but do not auto-fetch
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['lendSpots', timeRange?.from, timeRange?.until],
    queryFn: () => {
      if (!timeRange) throw new Error("No time range set");
      return getLendSpots(1, timeRange);
    },
    enabled: false, // Don't run automatically
  });

  // Callback when date changes
  const handleDateChange = (dates: [dayjs.Dayjs, dayjs.Dayjs] | null) => {
    if (!dates) return;

    const from = dates[0].toDate();
    const until = dates[1].toDate();

    setTimeRange({ from, until });

    // Refetch spots manually
    refetch().then((result) => {
      if (result.isError || !result.data) {
        console.error("Error fetching available spots:", result.error);
        return;
      }
      console.log("Available spots:", result.data);
      const availableSpotIds = result.data;
      const toDisableSpotIds = allSpotIds.filter(
        (id) => !availableSpotIds.includes(id)
      );
      setDisabledSpotIds(toDisableSpotIds);
    });
  };

  const isDateDisabled = (current: dayjs.Dayjs) =>
    current &&
    (current < dayjs().startOf("day") ||
      disabledDates.some((date) => current.isSame(date, "day")));

  type FormValues = {
    dateRange: [Date, Date] | null;
    startTime: Date;
    endTime: Date;
  };
  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      dateRange: null,
      startTime: dayjs("12:00", TIME_FORMAT).toDate(),
      endTime: dayjs("13:00", TIME_FORMAT).toDate(),
    },
  });

  const mergeDateAndTime = (date: Date, time: Date): Date => {
    const merged = new Date(date);
    merged.setHours(time.getHours(), time.getMinutes(), 0, 0);
    return merged;
  };

  

  const mutationLendSpot = useMutation({
    mutationFn: lendSpot,
    onSuccess: (data) => {
      console.log("Lend offer created:", data);
    },
    onError: (error) => {
      console.error("Error creating lend offer:", error);
    },
  });

  const handleSubmitLendOfferPost = (body: TimeRange) => {
    mutationLendSpot.mutate({
      parkingId: 1, // Replace with actual parking ID
      spotId: selectedSpotId ?? "",
      body,
    });
  };

  const onSubmit = (data: FormValues) => {
    if (!data.dateRange) return;

    const [startDate, endDate] = data.dateRange;

    handleSubmitLendOfferPost({
      from: mergeDateAndTime(startDate, data.startTime),
      until: mergeDateAndTime(endDate, data.endTime),
    });
  };

  return {
    control,
    handleSubmit,
    formState,
    isDateDisabled,
    onSubmit,
    handleDateChange,
  };
};

export default useParkingLendForm;