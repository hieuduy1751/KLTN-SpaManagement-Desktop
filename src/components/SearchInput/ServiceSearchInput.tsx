import { Select, SelectProps } from "antd";
import { useState } from "react";
import { searchServiceByName } from "../../services/product";
import { ProductType } from "../../types/product";

let timeout: ReturnType<typeof setTimeout> | null;
let currentValue: string;

const fetch = (value: string, callback: any) => {
  console.log('works')
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  const search = () => {
    searchServiceByName(value)
      .then((services: ProductType[]) => {
        if (currentValue === value) {
          const data = services.map((service: ProductType) => ({
            value: service.id,
            text: service.name + ' - ' + service.price
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

type ServiceSearchInputProps = {
  value: any
  onChange: any
  placeholder: string
}

export default function ServiceSearchInput({
  value,
  onChange,
  placeholder
}: ServiceSearchInputProps) {
  const [data, setData] = useState<SelectProps["options"]>([]);

  const handleSearch = (newValue: string) => {
    fetch(newValue, setData);
  };

  const handleChange = (newValue: string) => {
    onChange(newValue);
  };

  const handleFocus = () => {
    searchServiceByName('')
      .then((services: ProductType[]) => {
        const data = services.map((service: ProductType) => ({
          value: service.id,
          text: service.name + ' - ' + service.price
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
