import React, { useEffect, useMemo, useRef, useState } from "react";
import Checkbox from "@hui/_atoms/checkbox/Checkbox";


export type CheckboxGroupItem = {
  name: string;
  value: string;
  required: boolean;
  checked?: boolean;
};

export interface iCheckboxGroup {
  name: string;
  items: CheckboxGroupItem[];
  noneOfAboveOption?: boolean;
  onChange?: (value) => void;
}

const CheckboxGroup = ({
  name,
  items,
  noneOfAboveOption = false,
  onChange,
}: iCheckboxGroup) => {
  const myRef = useRef(null);
  const isItemChecked = (item: CheckboxGroupItem) => item.checked ? item.value : null

  const defaultValue = useMemo(
    () =>
      noneOfAboveOption
        ? items.map((item) => (isItemChecked(item))).concat([null])
        : items.map((item) => (isItemChecked(item))),
    [items, noneOfAboveOption]
  );
  const [value, setValue] = useState(defaultValue);

  useEffect(()=>{
    setValue(defaultValue)
  },[items, defaultValue])

  const onCheckedChange = (checked: boolean, index: number, optionValue: string) => {
    const valueCopy = [...value];

    valueCopy[index] = checked ? optionValue : null;
    if(noneOfAboveOption) { valueCopy[value.length - 1] = null }

    onChange(valueCopy);
    setValue(valueCopy);
  }

  const onNoneCheckedChange = (checked: boolean) => {
    const valueCopy = checked ? items.map(() => null).concat(["none"]) : items.map(() => null).concat([null]);
 
    onChange(valueCopy);
    setValue(valueCopy);
  }

  return (
    <>
      {items.map((option, index) => (
        <label
          htmlFor={`list-item-${option.value}`}
          className="tw-py-2 tw-flex tw-gap-4 tw-mb-1"
          key={option.value}
        >
          <Checkbox
            name={option.name}
            id={`list-item-${option.value}`}
            checked={value.includes(option.value)}
            onCheckedChange={(checked) => onCheckedChange(checked, index, option.value)}
            myRef={myRef}
          />
          <span className="tw-text-sm">{option.name}</span>
        </label>
      ))}
      {noneOfAboveOption && (
        <label
          htmlFor={`list-item-${name}-none`}
          className="tw-py-2 tw-flex tw-gap-4 tw-mb-1"
          key={"none"}
        >
          <Checkbox
            name="None of the above"
            id={`list-item-${name}-none`}
            checked={value.includes("none")}
            onCheckedChange={onNoneCheckedChange}
            myRef={myRef}
          />
          <span className="tw-text-sm">None of the above</span>
        </label>
      )}
    </>
  );
}

export default CheckboxGroup;