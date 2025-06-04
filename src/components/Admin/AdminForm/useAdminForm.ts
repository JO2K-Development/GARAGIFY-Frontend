export const TIME_FORMAT = "HH:mm";
import { useForm } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { borrowSpot, getBorrowSpots, getBorrowTimeRanges, TimeRange } from "@/api/parking";
import { useSpot } from "@/context/SpotProvider";

dayjs.extend(isBetween);

const useAdminForm = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayNumber = today.getTime();
  const { selectedSpotId, setDisabledSpotIds, allSpotIds } = useSpot();

  useEffect(() => {
      setDisabledSpotIds([])
  }, []);

  type FormValues = {
    dateRange: [Date, Date] | null;
    startTime: Date;
    endTime: Date;
    findSpecialSpots: boolean;
    findNonReparkedSpots: boolean;
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
  const startTime = watch("startTime");
  const endTime = watch("endTime");

  const mergeDateAndTime = (date: Date, time: Date): Date => {
    const merged = new Date(date);
    merged.setHours(time.getHours(), time.getMinutes(), 0, 0);
    return merged;
  };
    const {
    data,
    isLoading,
    error,
    refetch: refetchGetBorrow,
  } = useQuery({
    queryKey: ['borrowSpots'],
    queryFn: () => {
      if (!myDateRange) throw new Error("No time range set");

      return getBorrowSpots(1, {
        from: mergeDateAndTime(myDateRange[0], startTime),
        until: mergeDateAndTime(myDateRange[1], endTime),
      });
    },
    enabled: false, // Don't run automatically
  });


  const mutationLendSpot = useMutation({
    mutationFn: borrowSpot,
    onSuccess: (data) => {
      console.log("Lend offer created:", data);
    },
    onError: (error) => {
      console.error("Error creating lend offer:", error);
    },
  });


  type AvailableRange = { start: string; end: string };
  function getUnavailableDates(
    availableRanges: AvailableRange[],
    daysFromNow: number
  ): Dayjs[] {
    const unavailableDates: Dayjs[] = [];

    for (let i = 0; i < daysFromNow; i++) {
      const currentDate = dayjs().startOf("day").add(i, "day");

      const isAvailable = availableRanges.some(({ start, end }) => {
        const startDate = dayjs(start).startOf("day");
        const endDate = dayjs(end).startOf("day");
        return currentDate.isBetween(startDate, endDate, null, "[]");
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
  };
};

export default useAdminForm;
