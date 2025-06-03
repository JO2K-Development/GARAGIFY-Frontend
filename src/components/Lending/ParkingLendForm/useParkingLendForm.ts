export const TIME_FORMAT = "HH:mm";
import { set, useForm } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import isBetween from 'dayjs/plugin/isBetween';

import { useMutation, useQuery } from "@tanstack/react-query";
import { useSpot } from "@/context/SpotProvider";
import { useEffect, useState } from "react";
import {
  getLendSpots,
  getLendTimeRanges,
  lendSpot,
  TimeRange,
} from "@/api/parking";
import { time } from "console";
dayjs.extend(isBetween);

const useParkingLendForm = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayNumber = today.getTime();
  const { selectedSpotId, setDisabledSpotIds, allSpotIds, disabledDates, setDisabledDates } = useSpot();
  const [pickerKey, setPickerKey] = useState(0);

  const {
    refetch: refetchAvailableDates,
  } = useQuery({
    queryKey: ['lendDates'],
    queryFn: () => {
      return getLendTimeRanges(1, {
        untilWhen: new Date(todayNumber + 1000 * 60 * 60 * 24 * 50), // 50 days from now
      });
    },
    enabled: false, // Don't run automatically
  });

  useEffect(() => {
    // to jest endpoint
    refetchAvailableDates().then((result) => {
      console.log("Available dates:", result.data);
      const availableDateRanges = result.data; 
      const disabledDatesTmp = getUnavailableDates(availableDateRanges, 50); // Get unavailable dates for the next 50 days
      setDisabledDates(disabledDatesTmp); // Example of a hardcoded disabled date
      console.log("Disabled dates:", disabledDates.length);
    });
  }, [pickerKey]);
  
  

  type FormValues = {
    dateRange: [Date, Date] | null;
    startTime: Date ;
    endTime: Date ;
  };
  const { control, handleSubmit, formState, watch, reset } = useForm<FormValues>({
    defaultValues: {
      dateRange: null,
      startTime: (() => { const d = new Date(); d.setHours(12, 0, 0, 0); return d; })(),
      endTime: (() => { const d = new Date(); d.setHours(12, 0, 0, 0); return d; })(),
    },
  });

  const values = watch();

  const myDateRange = watch("dateRange");


  const mergeDateAndTime = (date: Date, time: Date): Date => {
    const merged = new Date(date);
    merged.setHours(time.getHours(), time.getMinutes(), 0, 0);
    return merged;
  };


    // Prepare the query, but do not auto-fetch
  const {
    data,
    isLoading,
    error,
    refetch: refetchGetLend,
  } = useQuery({
    queryKey: ['lendSpots'],
    queryFn: () => {
      if (!myDateRange) throw new Error("No time range set");

      return getLendSpots(1, {
        from: mergeDateAndTime(myDateRange[0], values.startTime),
        until: mergeDateAndTime(myDateRange[1], values.endTime),
      });
    },
    enabled: false, // Don't run automatically
  });

  useEffect(() => {
      const [ startTime, endTime ] = myDateRange ?? [null, null];
      if (!startTime || !endTime) {
        console.log("blokowanie :", myDateRange);
        setDisabledSpotIds(allSpotIds); // Disable all but the last spot if incomplete
      } else {
        refetchGetLend().then((result) => {
          const availableSpotIds = result.data;
          const toDisableSpotIds = allSpotIds.filter(
            (id) => !availableSpotIds.includes(id)
          );
          setDisabledSpotIds(toDisableSpotIds);
        });
      }
      console.log(allSpotIds, "allSpotIds");

  }, [myDateRange, pickerKey]);

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
    setPickerKey(k => k + 1);

    handleSubmitLendOfferPost({
      from: mergeDateAndTime(startDate, data.startTime),
      until: mergeDateAndTime(endDate, data.endTime),
    });
    reset();
  };

  type AvailableRange = { start: string; end: string };
  function getUnavailableDates(
  availableRanges: AvailableRange[],
  daysFromNow: number
): Dayjs[] {
  const unavailableDates: Dayjs[] = [];

  for (let i = 0; i < daysFromNow; i++) {
    const currentDate = dayjs().startOf('day').add(i, 'day');

    const isAvailable = availableRanges.some(({ start, end }) => {
      const startDate = dayjs(start).startOf('day');
      const endDate = dayjs(end).startOf('day');
      return currentDate.isBetween(startDate, endDate, null, '[]'); // inclusive
    });

    if (!isAvailable) {
      unavailableDates.push(currentDate);
    }
  }

  return unavailableDates;
}
  return {
    control,
    handleSubmit,
    formState,
    pickerKey,
    onSubmit,
  };
};

export default useParkingLendForm;