export const TIME_FORMAT = "HH:mm";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";

const useParkingBorrowForm = () => {
  const disabledDates = [
    dayjs("2025-05-12"),
    dayjs("2025-05-20"),
    dayjs("2025-06-01"),
  ];

  const isDateDisabled = (current: dayjs.Dayjs) =>
    current &&
    (current < dayjs().startOf("day") ||
      disabledDates.some((date) => current.isSame(date, "day")));

  type FormValues = {
    dateRange: [Date, Date] | null;
    startTime: Date;
    endTime: Date;
    findSpecialSpots: boolean;
    findNonReparkedSpots: boolean;
  };
  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      dateRange: null,
      startTime: dayjs("12:00", TIME_FORMAT).toDate(),
      endTime: dayjs("13:00", TIME_FORMAT).toDate(),
      findSpecialSpots: false,
      findNonReparkedSpots: false,
    },
  });

  const mergeDateAndTime = (date: Date, time: Date): Date => {
    const merged = new Date(date);
    merged.setHours(time.getHours(), time.getMinutes(), 0, 0);
    return merged;
  };

  const onSubmit = (data: FormValues) => {
    if (!data.dateRange) return;

    const [startDate, endDate] = data.dateRange;
    const start = mergeDateAndTime(startDate, data.startTime);
    const end = mergeDateAndTime(endDate, data.endTime);

    console.log({
      start,
      end,
      findSpecialSpots: data.findSpecialSpots,
      findNonReparkedSpots: data.findNonReparkedSpots,
    });
  };

  return {
    control,
    handleSubmit,
    formState,
    isDateDisabled,
    onSubmit,
  };
};

export default useParkingBorrowForm;
