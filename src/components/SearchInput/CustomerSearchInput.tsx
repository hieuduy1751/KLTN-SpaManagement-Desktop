import { Select, SelectProps } from "antd";
import { useState } from "react";
import { searchCustomerByName } from "../../services/customer";
import { CustomerType } from "../../types/customer";
import { CustomerClassEnum } from "../../enums/CustomerClass";

let timeout: ReturnType<typeof setTimeout> | null;
let currentValue: string;

const fetch = (value: string, callback: any) => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  const search = () => {
    searchCustomerByName(value)
      .then((customers: CustomerType[]) => {
        if (currentValue === value) {
          const data = customers.map((customer: CustomerType) => ({
            value: customer.id,
            text: customer.lastName + ' ' + customer.firstName + ' - ' + (customer.customerClass ? CustomerClassEnum[customer.customerClass as string] : ''),
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

type CustomerSearchInputProps = {
  value: any
  onChange: any
  placeholder: string
}

export default function CustomerSearchInput({
  value,
  onChange,
  placeholder
}: CustomerSearchInputProps) {
  const [data, setData] = useState<SelectProps["options"]>([]);

  const handleSearch = (newValue: string) => {
    fetch(newValue, setData);
  };

  const handleChange = (newValue: string) => {
    onChange(newValue);
  };

  const handleFocus = () => {
    searchCustomerByName('')
      .then((customers: CustomerType[]) => {
        const data = customers.map((customer: CustomerType) => ({
          value: customer.id,
          text: customer.lastName + ' ' + customer.firstName + ' - ' + (customer.customerClass ? CustomerClassEnum[customer.customerClass as string] : ''),
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
