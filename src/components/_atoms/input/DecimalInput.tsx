import React, { useState, useEffect, useRef } from "react";
import Cleave from 'cleave-zen';
const { formatNumeral, registerCursorTracker, DefaultNumeralDelimiter } = Cleave;
import classNames from "classnames";
import isMobile from "../../../es_utilities/isMobile";

interface iDecimalInput {
  hideLabel?: boolean;
  inputAlignment?: "left" | "right";
  label?: string;
  name: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
  value: string;
}

const DecimalInput = ({
  hideLabel = false,
  inputAlignment = "right",
  label,
  name,
  onChange,
  readOnly = false,
  value,
}: iDecimalInput) => {
  const [amount, setAmount] = useState(value ? formatNumeral(Number(value).toFixed(2)) : "");

  const inputRef = useRef(null);

  useEffect(() => registerCursorTracker({
    // eslint-disable-next-line xss/no-mixed-html
    input: inputRef.current as HTMLInputElement,
    delimiter: DefaultNumeralDelimiter
  }), []);

  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    setAmount(value);
  }, [value]);

  const handleChange = (event) => {
    const commaFormatted = formatNumeral(event.target.value);

    setAmount(commaFormatted);
    if (onChange) {
      onChange(commaFormatted);
    }
  };

  const handleFocus = () => {
    if (isMobile && inputRef.current) {
      inputRef.current.select();
    }
  }

  const handleBlur = (event) => {
    const { value } = event.target;

    if (value.length > 0) {
      const twoDPAmount = Number(value.replaceAll(/\,/g, "")).toFixed(2);
      setAmount(formatNumeral(twoDPAmount));
    }
  };

  return (
    <div className="tw-leading-5">
      <label
        className={classNames(
          "hnry-label",
          { "tw-sr-only": hideLabel },
        )}
        htmlFor={name}
      >
        {label}
      </label>
      <input
        className={classNames(
          "hnry-input",
          { "tw-text-right": inputAlignment === "right" },
          { "tw-text-left": inputAlignment === "left" },
        )}
        id={name}
        inputMode="text"
        onBlur={handleBlur}
        onChange={handleChange}
        onFocus={handleFocus}
        readOnly={readOnly}
        ref={inputRef}
        type="text"
        value={amount}
      />
      <input type="hidden" name={name} value={amount} />
    </div>
  );
};

export default DecimalInput;
