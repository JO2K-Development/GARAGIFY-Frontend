export const TIME_FORMAT = "HH:mm";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import { useMutation } from '@tanstack/react-query';
import { createLendOffer } from "@/api/api";
import { components } from "../../../../api/schema";
import { useSelectedSpot } from "@/app/context/SelectedSpotProvider";

const useParkingLendForm = () => {
  const selectedSpotRef = useSelectedSpot();

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


  const mutation = useMutation({
    mutationFn: createLendOffer,
    onSuccess: (data) => {
      console.log('Lend offer created:', data);
    },
    onError: (error) => {
      console.error('Error creating lend offer:', error);
    },
  });

    // Example usage
  const handleSubmitLendOfferPost = (offerData: components["schemas"]["LendOfferPostForm"]) => {
    mutation.mutate(offerData);
  };
  

  const onSubmit = (data: FormValues) => {
    if (!data.dateRange) return;

    const [startDate, endDate] = data.dateRange;
    const start = mergeDateAndTime(startDate, data.startTime);
    const end = mergeDateAndTime(endDate, data.endTime);

    const lendOfferData: components["schemas"]["LendOfferPostForm"] = {
      spot_id: "58c38b13-387c-462b-bf84-20f9bdf2986a", // Example owner ID, replace with actual
      start_date: start.toISOString(),
      end_date: end.toISOString(),
      // Add other required fields as necessary
    };
    //TODO: endpoincik i çağırılacak
    handleSubmitLendOfferPost(lendOfferData);
    console.log({
      spot_id: selectedSpotRef.current?.get("spotId"),
      start:start,
      end: end,
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

export default useParkingLendForm;
