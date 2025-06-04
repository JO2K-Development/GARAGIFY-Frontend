export const TIME_FORMAT = "HH:mm";
import { useForm } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { borrowSpot, getBorrowSpots, getBorrowTimeRanges, TimeRange } from "@/api/parking";
import { useSpot } from "@/context/SpotProvider";

dayjs.extend(isBetween);

const useParkingBorrowForm = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayNumber = today.getTime();
  const { selectedSpotId, setDisabledSpotIds, allSpotIds, disabledDates, setDisabledDates } = useSpot();
  
  const [pickerKey, setPickerKey] = useState(0);

  const { refetch: refetchAvailableDates } = useQuery({
    queryKey: ["borrowAvailableDates"],
    queryFn: () =>
      getBorrowTimeRanges(1, {
        untilWhen: new Date(todayNumber + 1000 * 60 * 60 * 24 * 50),
      }),
    enabled: false,
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

  useEffect(() => {
      const [ startTime, endTime ] = myDateRange ?? [null, null];
      if (!startTime || !endTime) {
        // console.log("blokowanie :", myDateRange);
        setDisabledSpotIds(allSpotIds); // Disable all but the last spot if incomplete
      } else {
        refetchGetBorrow().then((result) => {
          const availableSpotIds = result.data;
          const toDisableSpotIds = allSpotIds.filter(
            (id) => !availableSpotIds.includes(id)
          );
          setDisabledSpotIds(toDisableSpotIds);
        });
      }
      // console.log(allSpotIds, "allSpotIds");

  }, [myDateRange, pickerKey, startTime, endTime]);

  const mutationLendSpot = useMutation({
    mutationFn: borrowSpot,
    onSuccess: (data) => {
      console.log("Lend offer created:", data);
      refetchAvailableDates().then((result) => {
        console.log("Available dates:", result.data);
        const availableDateRanges = result.data; 
        const disabledDatesTmp = getUnavailableDates(availableDateRanges, 50); // Get unavailable dates for the next 50 days
        setDisabledDates(disabledDatesTmp); // Example of a hardcoded disabled date
        console.log("Disabled dates:", disabledDates.length);
      });
    },
    onError: (error) => {
      console.error("Error creating lend offer:", error);
    },
  });

  const handleSubmitBorrowPost = (body: TimeRange) => {
    mutationLendSpot.mutate({
      parkingId: 1, // Replace with actual parking ID
      spotId: selectedSpotId ?? "",
      body,
    });
  };

  const onSubmit = (data: FormValues) => {
    if (!data.dateRange) return;

    const [startDate, endDate] = data.dateRange;
    setPickerKey((k) => k + 1);

    handleSubmitBorrowPost({
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
    onSubmit,
    pickerKey,
  };
};

export default useParkingBorrowForm;
