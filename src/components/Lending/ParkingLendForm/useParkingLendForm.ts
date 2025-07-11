export const TIME_FORMAT = "HH:mm";
import { useForm } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSpot } from "@/context/SpotProvider";
import { useEffect, useState } from "react";
import {
  getLendSpots,
  getLendTimeRanges,
  lendSpot,
  TimeRange,
} from "@/api/parking";
import { useToast } from "@/context/ToastProvider";
dayjs.extend(isBetween);

const useParkingLendForm = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayNumber = today.getTime();
  const {
    setSelectedSpotId,
    selectedSpotId,
    setDisabledSpotIds,
    allSpotIds,
    setEnabledDates,
  } = useSpot();
  const [pickerKey, setPickerKey] = useState(0);
  const queryClient = useQueryClient();

  const range = 250;

  // Use the data directly from useQuery instead of refetch promise
  const {
    data: availableDateRanges,
    refetch: refetchAvailableDates
  } = useQuery({
    queryKey: ["lendDates"],
    queryFn: () => {
      return getLendTimeRanges(1, {
        untilWhen: new Date(todayNumber + 1000 * 60 * 60 * 24 * range),
      });
    },
    enabled: true, // Disable initial fetch
  });

  useEffect(() => {
    // This will run whenever availableDateRanges changes
    if (availableDateRanges) {
      const enabledDatesTmp = getAvailableDates(availableDateRanges, range);
      setEnabledDates(enabledDatesTmp);
    }
  }, [availableDateRanges, pickerKey]); // eslint-disable-line

  type FormValues = {
    dateRange: [Date, Date] | null;
    startTime: Date;
    endTime: Date;
  };
  const { control, handleSubmit, formState, watch, reset } =
    useForm<FormValues>({
      defaultValues: {
        dateRange: null,
        startTime: (() => {
          const d = new Date();
          d.setHours(12, 0, 0, 0);
          return d;
        })(),
        endTime: (() => {
          const d = new Date();
          d.setHours(12, 0, 0, 0);
          return d;
        })(),
      },
    });

  const myDateRange = watch("dateRange");
  const startTime = watch("startTime");
  const endTime = watch("endTime");

  const mergeDateAndTime = (date: Date, time: Date): Date => {
    const merged = new Date(date);
    merged.setHours(time.getHours(), time.getMinutes(), 0, 0);
    return merged;
  };

  // Prepare the query, but do not auto-fetch
  const {
    data: availableSpots,
    refetch: refetchGetLend,
  } = useQuery({
    queryKey: ["lendSpots"],
    queryFn: () => {
      if (!myDateRange) throw new Error("No time range set");

      return getLendSpots(1, {
        from: mergeDateAndTime(myDateRange[0], startTime),
        until: mergeDateAndTime(myDateRange[1], endTime),
      });
    },
    enabled: true, // Disable initial fetch
  });

  useEffect(() => {
    // Trigger fetch when date range changes
    if (myDateRange) {
      refetchGetLend();
    }
  }, [myDateRange, pickerKey, startTime, endTime]); // eslint-disable-line

  useEffect(() => {
    // This will run whenever availableSpots changes
    if (!myDateRange) {
      setDisabledSpotIds(allSpotIds);
    } else if (availableSpots) {
      const toDisableSpotIds = allSpotIds.filter(
        (id) => !availableSpots.includes(id)
      );
      setDisabledSpotIds(toDisableSpotIds);
    }
  }, [availableSpots, myDateRange]); // eslint-disable-line

  const toast = useToast();

  const mutationLendSpot = useMutation({
    mutationFn: lendSpot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lending"], refetchType: "all"});
      toast.success({
        message: "You have successfully created a lend offer!",
      });
      refetchAvailableDates().then((result) => {
        const availableDateRanges = result.data;
        const enabledDatesTmp = getAvailableDates(availableDateRanges, range); // Get unavailable dates for the next 50 days
        setEnabledDates(enabledDatesTmp);
      });
      // Refresh data after successful mutation
      if (myDateRange) {
        refetchGetLend();
      }
    },
    onError: () => {
      toast.error({
        message: "Error",
        description: "There was an error creating your lend offer.",
      });
    },
  });

  const handleSubmitLendOfferPost = (body: TimeRange) => {
    mutationLendSpot.mutate({
      parkingId: 1,
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
    setSelectedSpotId(null);
    setPickerKey((prev) => prev + 1); // Increment key to reset the date picker
 
    reset();
  };

  type AvailableRange = { start: string; end: string };
  function getAvailableDates(
    availableRanges: AvailableRange[],
    daysFromNow: number
  ): Dayjs[] {
    const availableDates: Dayjs[] = [];

    for (let i = 0; i < daysFromNow; i++) {
      const currentDate = dayjs().startOf("day").add(i, "day");

      const isAvailable = availableRanges.some(({ start, end }) => {
        const startDate = dayjs(start).startOf("day");
        const endDate = dayjs(end).startOf("day");
        return currentDate.isBetween(startDate, endDate, null, "[]");
      });

      if (isAvailable) {
        availableDates.push(currentDate);
      }
    }

    return availableDates;
  }

  return {
    control,
    handleSubmit,
    formState,
    pickerKey,
    onSubmit,
    selectedSpotId,
    setSelectedSpotId
  };
};

export default useParkingLendForm;
