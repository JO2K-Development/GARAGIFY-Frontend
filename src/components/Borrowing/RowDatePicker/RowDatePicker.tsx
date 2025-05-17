import dayjs, { Dayjs } from "dayjs";
import { useLayoutEffect, useState } from "react";
import styles from "./RowDatePicker.module.scss";

interface RowDatePickerProps {
  disabledDate: (currentDate: dayjs.Dayjs) => boolean
  value?: [Dayjs, Dayjs] | null
  onChange: (dates: [Dayjs, Dayjs] | null) => void
}

const RowDatePicker = ({ disabledDate, value, onChange }: RowDatePickerProps) => {
  const [dateList, setDateList] = useState<Dayjs[]>([dayjs(), dayjs().add(1, "day")]);
  const [startDay, setStartDay] = useState<Dayjs | null>(value?.[0] ?? null);
  const [endDay, setEndDay] = useState<Dayjs | null>(value?.[1] ?? null);
  const [intervalsLeft, setIntervalsLeft] = useState([]);
  const [intervalsRight, setIntervalsRight] = useState([]);
  const [intervalIdLeft, setIntervalIdLeft] = useState();
  const [intervalIdRight, setIntervalIdRight] = useState();

  const dateOnClick = (date: Dayjs) => {
    if (disabledDate(date)) {
      return;
    }

    if ((startDay !== null && endDay !== null) || startDay === null || date.isBefore(startDay, "day")) {
      setStartDay(date);
      setEndDay(null);
      return;
    }

    if (endDay === null) {
      // get all dates between startDay and date
      let currentDate = startDay.clone();
      while (currentDate.isBefore(date, "day")) {
        currentDate = currentDate.add(1, "day");
        if (disabledDate(currentDate)) {
          setStartDay(date);
          return;
        }
      }
      setEndDay(date);
      return;
    }

  }

  const getNumberStyle = (day: Dayjs) => {
    if (disabledDate(day) || day.isBefore(dayjs(), "day")) {
      return styles.DisabledDay;
    }

    if (day.isSame(startDay, "day")) {
      return styles.StartDay;
    }

    if (day.isSame(endDay, "day")) {
      return styles.EndDay;
    }

    if (day.isAfter(startDay, "day") && day.isBefore(endDay, "day")) {
      return styles.SelectedDay
    }

    return styles.NormalDay;
  }

  const getMonthStyle = (day: Dayjs, index: number) => {
    if (day.date() === 1 || index === 0) {
      if (day.isAfter(startDay, "day") && day.isBefore(endDay, "day")) {
        return styles.SelectedMonth;
      }
      return styles.Month;
    }
    return styles.HiddenMonth;
  }

  const generateDateList = () => {
    let date: Dayjs = dayjs();
    const newDateList: Dayjs[] = [];
    for (let i = 0; i < 30; i++) {
      newDateList.push(dayjs(date));
      date = date.add(1, "day");
    }
    return newDateList;
  };

  useLayoutEffect(() => {
    const newDateList = generateDateList();
    setDateList(newDateList);
  }, []);

  return (
    <div>
      <div id="scroll" className={ styles.DateContainer }>
        { dateList.map((d, index) => (
          <div
            key={ index }
            className="flex flex-col justify-center items-center font-bold"
          >
            <span className="text-[13px] leading-10">{ d.format('dddd')[0] }</span>
            <div className="w-[40px] m-0 p-0 h-0 border-2 border-purple-400"/>
            <div
              onClick={ () => dateOnClick(d) }
              className={ getNumberStyle(d) }
            >
                <span className={ styles.DayNumber }>
                  { ("0" + d.date()).slice(-2) }
                </span>
            </div>
            <span
              className={ getMonthStyle(d, index) }
            >
                { d.format('MMM').toUpperCase() }
              </span>
          </div>
        )) }
      </div>
    </div>
  )
};

export default RowDatePicker;