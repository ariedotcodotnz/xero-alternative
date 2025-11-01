import React, { useRef } from "react";
import classNames from "classnames";
import Icon from "../icons/icon/Icon";
import { iInput } from "./Input";

// We only allow types we listed here until we have tested other types
export const InputTypes = ["text", "hidden", "email", "number"] as const;
export type InputType = (typeof InputTypes)[number];
const allowedIconChars = ["%"];

const InputNoBorder = ({
  autocomplete = "off",
  defaultValue,
  disabled = false,
  id,
  inputClasses,
  inputMode = "text",
  label = "Label",
  labelClasses,
  labelRendered = true,
  legacyStyles = false,
  max = undefined,
  name,
  onBlur = null,
  placeholder = "",
  readOnly = undefined,
  required = false,
  rightIcon = undefined,
  setValue,
  step = undefined,
  type = "text",
  value,
}: iInput) => {
  const idWithFallback = id || name || crypto.randomUUID();
  const inputRef = useRef(null);

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Enter" || event.keyCode === 13) {
      inputRef.current.blur();
    }
  }

  return (
    <>
      {labelRendered && type !== "hidden" && (
        <label
          htmlFor={idWithFallback}
          className={classNames({
            "hnry-label": !legacyStyles,
            "hnry-label--legacy": legacyStyles,
            [`${labelClasses}`]: labelClasses,
            "after:tw-content-['*'] after:tw-inline after:tw-text-red after:tw-ml-1":
                            required,
          })}
        >
          {label}
        </label>
      )}
      <div className="tw-relative">
        <input
          ref={inputRef}
          onBlur={onBlur}
          onKeyUp={handleKeyUp}
          autoComplete={autocomplete}
          className={classNames({
            "hnry-input no-bs": !legacyStyles,
            "hnry-input--legacy": legacyStyles,
            [`${inputClasses}`]: inputClasses,
          })}
          id={idWithFallback}
          inputMode={inputMode}
          name={name}
          onChange={(e) => setValue && setValue(e.target.value)}
          placeholder={placeholder}
          required={required}
          type={type}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          readOnly={readOnly}
          step={step}
          max={max}
        />
        {rightIcon && (
          <div className="hnry-input__right-icon">
            {allowedIconChars.includes(rightIcon) ? <span>{rightIcon}</span> : <Icon type={rightIcon} />}
          </div>
        )}
      </div>
    </>
  );
};

export default InputNoBorder;
