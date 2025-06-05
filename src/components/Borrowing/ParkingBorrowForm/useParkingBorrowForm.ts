export const TIME_FORMAT = "HH:mm";
import { useForm } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  borrowSpot,
  getBorrowSpots,
  getBorrowTimeRanges,
  TimeRange,
} from "@/api/parking";
import { useSpot } from "@/context/SpotProvider";
import { useToast } from "@/context/ToastProvider";

dayjs.extend(isBetween);

const useParkingBorrowForm = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayNumber = today.getTime();
  const {
    selectedSpotId,
    setDisabledSpotIds,
    disabledSpotIds,
    allSpotIds,
    setEnabledDates,
    setSelectedSpotId,
  } = useSpot();

  const [pickerKey, setPickerKey] = useState(0);
  const queryClient = useQueryClient();
  const range = 250;

  // Use data directly from useQuery instead of refetch promise
  const {
    data: availableDateRanges,
    refetch: refetchAvailableDates
  } = useQuery({
    queryKey: ["borrowAvailableDates"],
    queryFn: () =>
      getBorrowTimeRanges(1, {
        untilWhen: new Date(todayNumber + 1000 * 60 * 60 * 24 * range),
      }),
    enabled: true,
  });

  useEffect(() => {
    // Trigger initial fetch    
    refetchAvailableDates();
  }, []);

  useEffect(() => {
    // This will run whenever availableDateRanges changes
    if (availableDateRanges) {
      const enabledDatesTmp = getAvailableDates(availableDateRanges, range);
      setEnabledDates(enabledDatesTmp);
    }
  }, [availableDateRanges, pickerKey]);

  type FormValues = {
    dateRange: [Date, Date] | null;
    startTime: Date;
    endTime: Date;
    findSpecialSpots: boolean;
    findNonReparkedSpots: boolean;
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

  // Use data directly from useQuery
  const {
    data: availableSpots,
    refetch: refetchGetBorrow,
  } = useQuery({
    queryKey: ["borrowSpots", myDateRange, startTime, endTime],
    queryFn: () => {
      if (!myDateRange) throw new Error("No time range set");

      return getBorrowSpots(1, {
        from: mergeDateAndTime(myDateRange[0], startTime),
        until: mergeDateAndTime(myDateRange[1], endTime),
      });
    },
    enabled: true,
  });

  useEffect(() => {
    // Trigger fetch when date range changes
    if (myDateRange) {
      refetchGetBorrow();
    }
  }, [myDateRange, pickerKey, startTime, endTime]);

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
  }, [availableSpots, myDateRange]);



  const toast = useToast();

  const mutationBorrowSpot = useMutation({
    mutationFn: borrowSpot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["borrowing"], refetchType: "all"});
      // Refresh both queries after successful mutation
      refetchAvailableDates().then((result) => {
        const availableDateRanges = result.data;
        const enabledDatesTmp = getAvailableDates(availableDateRanges, range); // Get unavailable dates for the next 50 days
        setEnabledDates(enabledDatesTmp);
      });
      if (myDateRange) {
        refetchGetBorrow();
      }
      toast.success({
        message: 'Success!',
        description: 'You have successfully borrowed a spot!',
      });
    },
    onError: (error) => {
      toast.error({
        message: 'Error',
        description: 'There was an error borrowing the spot.',
      });
    },
  });

  const handleSubmitBorrowPost = (body: TimeRange) => {
    mutationBorrowSpot.mutate({
      parkingId: 1,
      spotId: selectedSpotId ?? "",
      body,
    });
  };

  const onSubmit = (data: FormValues) => {
    if (!data.dateRange) return;

    const [startDate, endDate] = data.dateRange;

    handleSubmitBorrowPost({
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
    onSubmit,
    pickerKey,
    selectedSpotId,
    setSelectedSpotId,
    disabledSpotIds,
  };
};

export default useParkingBorrowForm;