import { Select, SelectProps } from "antd";
import { useState } from "react";
import { searchStaffByName } from "../../services/staff";
import { StaffType } from "../../types/staff";
import POSITION from "../../constants/position";

let timeout: ReturnType<typeof setTimeout> | null;
let currentValue: string;

const fetch = (value: string, callback: any) => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  const search = () => {
    searchStaffByName(value)
      .then((staffs: StaffType[]) => {
        if (currentValue === value) {
          const data = staffs.map((staff: StaffType) => ({
            value: staff.id,
            text: staff.lastName + ' ' + staff.firstName + ' - ' + (staff.position ? POSITION[staff.position as string] : ''),
          }));
          callback(data);
        }
      })
  };
  if (value) {
    timeout = setTimeout(search, 300);
  } else {
    callback([]);
  }
};

type EmployeeSearchInputProps = {
  value: any
  onChange: any
  placeholder: string
}

export default function EmployeeSearchInput({
  value,
  onChange,
  placeholder
}: EmployeeSearchInputProps) {
  const [data, setData] = useState<SelectProps["options"]>([]);

  const handleSearch = (newValue: string) => {
    fetch(newValue, setData);
  };

  const handleChange = (newValue: string) => {
    onChange(newValue);
  };

  const handleFocus = () => {
    searchStaffByName('')
      .then((staffs: StaffType[]) => {
        const data = staffs.map((staff: StaffType) => ({
          value: staff.id,
          text: staff.lastName + ' ' + staff.firstName + ' - ' + (staff.position ? POSITION[staff.position as string] : ''),
        }));
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setData(data)
      })
  }

  return (
    <Select
      showSearch
      value={value}
      placeholder={placeholder}
      defaultActiveFirstOption={false}
      suffixIcon={null}
      filterOption={false}
      onFocus={handleFocus}
      onSearch={handleSearch}
      onChange={handleChange}
      notFoundContent={null}
      options={(data || []).map((d) => ({
        value: d.value,
        label: d.text,
      }))}
    />
  );
}
