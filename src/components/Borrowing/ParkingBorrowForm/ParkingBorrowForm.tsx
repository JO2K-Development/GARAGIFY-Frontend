"use client";
import { Button, Checkbox, Flex, TimePicker } from "antd";
import { Controller } from "react-hook-form";
import labels from "@/labels.json";
import dayjs from "dayjs";
import useParkingBorrowForm, { TIME_FORMAT } from "./useParkingBorrowForm";
import RowDatePicker from "@/components/Borrowing/RowDatePicker/RowDatePicker";
import ParkingView from "@/components/Parking/View/ParkingView/ParkingView";
const {
  borrowing: {
    form: { dateRangeRequired, findSpecialSpots, findNonReparkedSpots, submit },
  },
} = labels;
const ParkingBorrowForm = () => {
  const {
    control,
    handleSubmit,
    onSubmit,
    pickerKey,
    formState: { errors },
    selectedSpotId,
    setSelectedSpotId,
    disabledSpotIds,
  } = useParkingBorrowForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex vertical gap="large" align="center">
        <Controller
          name="dateRange"
          control={control}
          rules={{ required: dateRangeRequired }}
          render={({ field }) => (
            <RowDatePicker
              key={pickerKey}
              {...field}
              value={
                field.value
                  ? [dayjs(field.value[0]), dayjs(field.value[1])]
                  : null
              }
              onChange={(dates) => {
                field.onChange(
                  dates ? [dates[0]?.toDate(), dates[1]?.toDate()] : null
                )
                if (!dates || (dates && dates[1] === null)) {
                    console.log("Resetting selected spot ID");
                    setSelectedSpotId(null);
                  }
              }
              }
            />
          )}
        />
        {errors.dateRange && (
          <p style={{ color: "red" }}>{errors.dateRange.message}</p>
        )}
        <Flex align="center" gap="large">
          <Flex vertical gap="middle">
            <Controller
              name="findSpecialSpots"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                >
                  {findSpecialSpots}
                </Checkbox>
              )}
            />
            <Controller
              name="findNonReparkedSpots"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                >
                  {findNonReparkedSpots}
                </Checkbox>
              )}
            />
          </Flex>
          <Controller
            name="startTime"
            control={control}
            render={({ field }) => (
              <TimePicker
                format={TIME_FORMAT}
                value={dayjs(field.value)}
                onChange={(time) => field.onChange(time?.toDate())}
              />
            )}
          />
          <Controller
            name="endTime"
            control={control}
            render={({ field }) => (
              <TimePicker
                format={TIME_FORMAT}
                value={dayjs(field.value)}
                onChange={(time) => field.onChange(time?.toDate())}
              />
            )}
          />
          
        </Flex>
        <ParkingView/>
        <Button type="primary" htmlType="submit" disabled={!selectedSpotId}>
          {submit}
        </Button>
      </Flex>
    </form>
  );
};

export default ParkingBorrowForm;
