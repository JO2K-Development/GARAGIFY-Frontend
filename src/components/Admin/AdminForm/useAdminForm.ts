import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useEffect } from "react";
import { useSpot } from "@/context/SpotProvider";

dayjs.extend(isBetween);

const useAdminForm = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  today.getTime();
  const { setDisabledSpotIds } = useSpot();

  useEffect(() => {
      setDisabledSpotIds([]);
  }, []); // eslint-disable-line

  type FormValues = {
    dateRange: [Date, Date] | null;
    startTime: Date;
    endTime: Date;
    findSpecialSpots: boolean;
    findNonReparkedSpots: boolean;
  };

  const { control, handleSubmit, formState, watch } = useForm<FormValues>({
    defaultValues: {
      dateRange: null,
      startTime: (() => { const d = new Date(); d.setHours(12, 0, 0, 0); return d; })(),
      endTime: (() => { const d = new Date(); d.setHours(12, 0, 0, 0); return d; })(),
    },
  });

  watch();
  watch("dateRange");
  watch("startTime");
  watch("endTime");

  return {
    control,
    handleSubmit,
    formState,
  };
};

export default useAdminForm;
