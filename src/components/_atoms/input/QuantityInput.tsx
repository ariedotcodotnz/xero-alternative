import React from "react";
import classNames from "classnames";
import Input from "./Input";

interface iQuantityInput {
  id?: string
  label?: string;
  setValue?: (arg0: string) => void;
  showLabel?: boolean;
  value?: string;
}

const QuantityInput = ({
  id,
  label,
  setValue,
  showLabel,
  value = ""
}: iQuantityInput) => {
  const handleValueChange = (v) => v.match(/^[\d.,]*$/) && setValue(v);

  return (
  <>
    <label
      htmlFor={id}
      className={
        showLabel
          ? classNames(
              "!tw-flex tw-flex-col tw-space-y-1",
              "hnry-label",
            )
          : "tw-sr-only"
      }
    >
      {label}
    </label>
    <Input
      setValue={handleValueChange}
      value={value}
      labelRendered={false}
      type="text"
      inputClasses="!tw-text-clip"
      inputMode="decimal"
      id={id}
    />
  </>
)};

export default QuantityInput;
