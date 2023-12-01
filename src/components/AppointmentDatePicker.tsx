import { DatePicker } from "antd";
import { DatePickerProps, RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";

type AppointmentDatePickerProps = {
  placeholder: string
  value: any
  onChange: any
  disabled: boolean
}

export default function AppointmentDatePicker({
  placeholder,
  value,
  onChange,
  disabled = false
}: AppointmentDatePickerProps) {
  const range = (start: number, end: number) => {
    const result = [];
    for (let i = start; i < end; i++) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      result.push(i);
    }
    return result;
  };

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current < dayjs().startOf("day");
  };

  const disabledDateTime = () => ({
    disabledHours: () => {
      const now = dayjs().hour()
      return [...range(0, 8), ...range(20, 24), ...range(0, now)]
    },
  });

  const onOk = (
    value: DatePickerProps["value"] | RangePickerProps["value"]
  ) => {
    const v = dayjs(value?.toString())
    onChange(v.set('seconds', 0).set('minutes', 0))
  };

  const customFormat: DatePickerProps["format"] = (value) =>
    `Ngày ${value.format("DD/MM/YYYY")} - ${value.format("HH")}:00 giờ`;

  return (
    <DatePicker
      disabledDate={disabledDate}
      disabledTime={disabledDateTime}
      showTime
      showMinute={false}
      showSecond={false}
      format={customFormat}
      onOk={onOk}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
    />
  );
}
