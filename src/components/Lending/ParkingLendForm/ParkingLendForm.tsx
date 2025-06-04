"use client";
import { Button, Checkbox, Flex, TimePicker } from "antd";
import { Controller } from "react-hook-form";
import labels from "@/labels.json";
import dayjs from "dayjs";
import useParkingLendForm, { TIME_FORMAT } from "./useParkingLendForm";
import RowDatePicker from "@/components/Borrowing/RowDatePicker/RowDatePicker";
import ParkingView from "@/components/Parking/View/ParkingView/ParkingView";

const {
  lending: {
    form: { dateRangeRequired, submit },
  },
} = labels;
const ParkingLendForm = () => {
  const {
    control,
    handleSubmit,
    onSubmit,
    pickerKey,
    formState: { errors },
  } = useParkingLendForm();

  
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
            <p></p>
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
        <Button type="primary" htmlType="submit">
          {submit}
        </Button>
      </Flex>
    </form>
  );
};

export default ParkingLendForm;
