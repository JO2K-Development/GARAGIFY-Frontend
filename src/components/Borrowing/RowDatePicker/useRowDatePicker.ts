import dayjs, { Dayjs } from "dayjs";
import { useLayoutEffect, useState, useEffect, useRef } from "react";
import styles from "@/components/Borrowing/RowDatePicker/RowDatePicker.module.scss";
import { useSpot } from "@/context/SpotProvider";

interface useRowDatePickerProps {
  value?: [Dayjs, Dayjs] | null;
  onChange: (dates: [Dayjs, Dayjs] | null) => void;
}

const useRowDatePicker = ({
  value,
  onChange,
}: useRowDatePickerProps) => {


  const { enabledDates } = useSpot();
  const [dateList, setDateList] = useState<Dayjs[]>([
    dayjs(),
    dayjs().add(1, "day"),
  ]);
  const [startDay, setStartDay] = useState<Dayjs | null>(value?.[0] ?? null);
  const [endDay, setEndDay] = useState<Dayjs | null>(value?.[1] ?? null);
  const [dayOffset, setDayOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dayRef = useRef<HTMLDivElement | null>(null);
  const [daysToShow, setDaysToShow] = useState(20);

  const calculateDaysToShow = () => {
    if (containerRef.current && dayRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const actualDayWidth = dayRef.current.offsetWidth;

      if (actualDayWidth > 0) {
        const newDaysToShow = Math.floor(containerWidth / actualDayWidth);
        setDaysToShow(newDaysToShow);
      }
    }
  };

  useEffect(() => {
    calculateDaysToShow();
    window.addEventListener("resize", calculateDaysToShow);
    setStartDay(null);
    setEndDay(null);
    return () => window.removeEventListener("resize", calculateDaysToShow);
  }, [enabledDates]);

  const dateOnClick = (date: Dayjs) => {
    if (!enabledDate(date)) {
      return;
    }

    if (
      (startDay !== null && endDay !== null) ||
      startDay === null ||
      date.isBefore(startDay, "day")
    ) {
      setStartDay(date);
      setEndDay(null);
      return;
    }

    if (endDay === null) {
      // get all dates between startDay and date
      let currentDate = startDay.clone();
      while (currentDate.isBefore(date, "day")) {
        currentDate = currentDate.add(1, "day");
        if (!enabledDate(currentDate)) {
          setStartDay(date);
          return;
        }
      }
      setEndDay(date);
      return;
    }
  };

  const getNumberStyle = (day: Dayjs) => {
    if (!enabledDate(day)) {
      return styles.DisabledDay;
    }

    if (day.isSame(startDay, "day")) {
      if (day.isSame(endDay, "day") || endDay === null) {
        return styles.StartEndDay;
      }
      return styles.StartDay;
    }

    if (day.isSame(endDay, "day")) {
      return styles.EndDay;
    }

    if (day.isAfter(startDay, "day") && day.isBefore(endDay, "day")) {
      return styles.SelectedDay;
    }

    return styles.NormalDay;
  };

  const getMonthStyle = (day: Dayjs, index: number) => {
    if (day.date() === 1 || index === 0) {
      if (
        (day.isAfter(startDay, "day") && day.isBefore(endDay, "day")) ||
        day.isSame(startDay, "day") ||
        day.isSame(endDay, "day")
      ) {
        return styles.SelectedMonth;
      }
      return styles.Month;
    }
    return styles.HiddenMonth;
  };

  const generateDateList = (offset: number) => {
    let date: Dayjs = dayjs().add(offset, "day");
    const newDateList: Dayjs[] = [];
    for (let i = 0; i < daysToShow; i++) {
      newDateList.push(dayjs(date));
      date = date.add(1, "day");
    }
    return newDateList;
  };

  useEffect(() => {
    if (startDay && endDay) {
      onChange?.([startDay, endDay]);
    } else {
      onChange?.(null);
    }
  }, [startDay, endDay]); // eslint-disable-line

  useLayoutEffect(() => {
    const newDateList = generateDateList(dayOffset);
    setDateList(newDateList);
  }, [daysToShow, dayOffset, enabledDates]); // eslint-disable-line

  const rightArrowClick = () => {
    setDayOffset(dayOffset + Math.floor(daysToShow / 3));
  };

  const leftArrowClick = () => {
    setDayOffset(dayOffset - Math.floor(daysToShow / 3));
  };

  const enabledDate = (current: dayjs.Dayjs) =>
      current &&
      (current >= dayjs().startOf("day") &&
        enabledDates.some((date) => current.isSame(date, "day")));

  return {
    dateList,
    setDateList,
    startDay,
    setStartDay,
    endDay,
    setEndDay,
    containerRef,
    dayRef,
    setDaysToShow,
    dateOnClick,
    getNumberStyle,
    getMonthStyle,
    rightArrowClick,
    leftArrowClick,
  };
};

export default useRowDatePicker;
