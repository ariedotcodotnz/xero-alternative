import React from "react";
import classNames from "classnames";
import Cleave from "cleave.js/react";
import Icon from "../icons/icon/Icon";

interface iInputPrice {
  currencySign?: string;
  disabled?: boolean;
  hideLabel?: boolean;
  invalid?: string;
  id?: string;
  label: string;
  name: string;
  onBlur?: (string) => void;
  onChange?: (string) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  value?: string | number;
  readOnly?: boolean;
  required?: boolean;
  requiredIconOnly?: boolean;
  paragraphError?:boolean;
}

const InputPrice = ({
  currencySign = "$",
  disabled = false,
  hideLabel = false,
  id,
  invalid,
  label,
  name,
  onBlur,
  onChange,
  onKeyUp,
  placeholder = "0.00",
  value,
  readOnly,
  required = false,
  requiredIconOnly = false,
  paragraphError = true
}: iInputPrice) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement & { rawValue: string }>) => {
    if (onChange) {
      onChange(e.target.rawValue);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement & { rawValue: string }>) => {
    if (onBlur) {
      onBlur(parseFloat(e.target.rawValue || "0").toFixed(2));
    }
  };

  return (
    <div className="tw-w-full">
      <label
        htmlFor={id || name}
        className={classNames("hnry-label", { "tw-sr-only": hideLabel, "hnry-label--required": required || requiredIconOnly })}
      >
        {label}
      </label>
      <div className="hui-input-price">
        {(currencySign) && <div className="hui-input-price__currency">
          <span>{currencySign}</span>
        </div>}
        <Cleave
          options={{
            numeral: true,
            numeralThousandsGroupStyle: "thousand",
            numeralDecimalScale: 2,
            stripLeadingZeroes: true,
          }}
          onChange={handleChange}
          onBlur={handleBlur}
          value={value}
          className={classNames("hnry-input no-bs", { "hnry-input--invalid": invalid }, { "hnry-currency-sign": currencySign })}
          placeholder={placeholder}
          disabled={disabled}
          name={name}
          id={id || name}
          readOnly={readOnly}
          inputMode="decimal"
          required={required}
          onKeyUp={onKeyUp}
        />
        {invalid && (
          <div className="tw-pointer-events-none tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-pr-3">
            <Icon type="ExclamationCircleIcon" classes="tw-text-red-500" />
          </div>
        )}
        <input type="hidden" name={name} value={value} />
      </div>
      {invalid && paragraphError ? <p className="tw-mt-2 tw-text-sm tw-text-red-600 tw-block">{invalid}</p> :null }
      {invalid && !paragraphError ? <div className="tw-mt-2 tw-text-sm tw-text-red-600 tw-block">{invalid}</div> : null}
    </div>
  );
};

export default InputPrice;
