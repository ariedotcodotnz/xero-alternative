import React, { useRef } from "react";
import classNames from "classnames";
import Icon, { IconType } from "../icons/icon/Icon";

// We only allow types we listed here until we have tested other types
export const InputTypes = ["text", "hidden", "email", "number"] as const;
export type InputType = (typeof InputTypes)[number];
const allowedIconChars = ["%"];

export interface iInput extends Partial<HTMLInputElement> {
  disabled?: boolean;
  inputClasses?: string;
  inputMode?: "email" | "search" | "text" | "url" | "none" | "tel" | "numeric" | "decimal";
  label?: string;
  labelClasses?: string;
  labelRendered?: boolean;
  legacyStyles?: boolean;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  readOnly?: boolean;
  rightIcon?: IconType | typeof allowedIconChars[number];
  setValue?: (value: string) => void;
  type?: InputType;
  value?: string;
  invalid?: string;
  requiredIconOnly?: boolean; // render red * without HTML required validation
  stylisedError?: boolean
  testId?: string
}

const Input = ({
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
  onClick,
  onFocus,
  placeholder = "",
  readOnly = undefined,
  required = false,
  rightIcon = undefined,
  setValue,
  step = undefined,
  type = "text",
  value,
  pattern = null,
  title = null,
  invalid,
  requiredIconOnly = false,
  stylisedError = true,
  testId = null
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
              required || requiredIconOnly,
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
            "hnry-input--invalid": invalid,
            [`${inputClasses}`]: inputClasses,
          })}
          id={idWithFallback}
          inputMode={inputMode}
          name={name}
          onClick={onClick}
          onChange={(e) => setValue && setValue(e.target.value)}
          onFocus={onFocus}
          placeholder={placeholder}
          pattern={pattern}
          required={required}
          type={type}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          readOnly={readOnly}
          step={step}
          max={max}
          title={title}
          data-testid={testId}
        />
        {rightIcon && (
          <div className="hnry-input__right-icon">
            {allowedIconChars.includes(rightIcon) ? <span>{rightIcon}</span> : <Icon type={rightIcon} />}
          </div>
        )}
        {invalid && (
          <div className={classNames("tw-pointer-events-none tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center", { "tw-pr-3": !rightIcon, "tw-pr-8": rightIcon })}>
            <Icon type="ExclamationCircleIcon" classes="tw-text-red-500" />
          </div>
        )}
      </div>
      {invalid && stylisedError ? <p className="tw-mt-2 tw-text-sm tw-text-red-600 tw-block">{invalid}</p> :null }
      {invalid && !stylisedError ? <div className="tw-mt-2 tw-text-sm tw-text-red-600 tw-block">{invalid}</div> : null}
    </>
  );
};

export default Input;
