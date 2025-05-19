import useRowDatePicker from "./useRowDatePicker";
import dayjs, { Dayjs } from "dayjs";
import styles from "./RowDatePicker.module.scss";
import { LeftOutlined, MinusOutlined, RightOutlined } from "@ant-design/icons";
import { DatePicker } from "antd";

interface RowDatePickerProps {
  disabledDate: (currentDate: dayjs.Dayjs) => boolean
  value?: [Dayjs, Dayjs] | null
  onChange: (dates: [Dayjs, Dayjs] | null) => void
}

const RowDatePicker = ({ disabledDate, value, onChange }: RowDatePickerProps) => {

  const {
    dateList,
    startDay,
    endDay,
    containerRef,
    dayRef,
    dateOnClick,
    getNumberStyle,
    getMonthStyle,
    rightArrowClick,
    leftArrowClick
  } = useRowDatePicker({ disabledDate, value, onChange });

  return (
    <div className={ styles.OuterContainer }>
      <div className={ styles.PreviewContainer }>
        <div>
          <DatePicker value={ startDay } disabled/>
        </div>
        <MinusOutlined/>
        <div>
          <DatePicker value={ endDay } disabled/>
        </div>
      </div>
      <div className={ styles.InnerContainer }>
        <div className={ styles.ArrowContainer } onClick={ leftArrowClick }>
          <LeftOutlined/>
        </div>
        <div id="scroll" className={ styles.DateContainer } ref={ containerRef }>
          { dateList.map((d, index) => (
            <div key={ index } ref={ index === 0 ? dayRef : null }>
              <span className={ styles.DayOfWeek }>{ d.format('dddd')[0] }</span>
              <div className={ styles.LineDivider }/>
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
        <div className={ styles.ArrowContainer } onClick={ rightArrowClick }>
          <RightOutlined/>
        </div>
      </div>
    </div>

  )
};

export default RowDatePicker;