export const TIME_FORMAT = "HH:mm";
import { useForm } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { borrowSpot, getBorrowSpots, getBorrowTimeRanges, TimeRange } from "@/api/parking";
import { useSpot } from "@/context/SpotProvider";
import { assignUser, getUsers } from "@/api/admin";

dayjs.extend(isBetween);

const useAdminForm = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayNumber = today.getTime();
  const { selectedSpotId, setDisabledSpotIds, allSpotIds } = useSpot();

  useEffect(() => {
      setDisabledSpotIds([]);
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


  return {
    control,
    handleSubmit,
    formState,
  };
};

export default useAdminForm;
