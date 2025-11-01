import React from "react";
import classNames from "classnames";
import Tooltip, { Placement } from "../../_atoms/tooltip/Tooltip";
import Input, { iInput } from "../../_atoms/input/Input";

interface iInputWithTooltip extends iInput {
  id: string;
  label: string;
  learnMoreLink?: string;
  popoverMessage: string;
  placement?: Placement;
}

const InputWithTooltip = ({
  id,
  label,
  type = "text",
  popoverMessage,
  learnMoreLink,
  name,
  step,
  rightIcon,
  setValue,
  value,
  defaultValue,
  max,
  required,
  disabled,
  placeholder = "",
  placement = "top",
  invalid,
  onBlur,
}: iInputWithTooltip) => {
  const idWithFallback = id || name || crypto.randomUUID();
  return (
    <>
      <label
        className={classNames("hnry-label", { "hnry-label--required": required })}
        htmlFor={idWithFallback}
      >
        {label}
        <Tooltip
          popoverMessage={popoverMessage}
          placement={placement}
          learnMore={learnMoreLink}
          buttonClasses="!tw-align-sub"
        />
      </label>
      <Input
        id={idWithFallback}
        type={type}
        labelRendered={false}
        name={name}
        step={step}
        rightIcon={rightIcon}
        setValue={setValue}
        value={value}
        defaultValue={defaultValue}
        max={max}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        invalid={invalid}
        onBlur={onBlur}
      />
    </>
  )
};

export default InputWithTooltip;
