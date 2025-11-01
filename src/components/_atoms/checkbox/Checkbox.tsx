import React from "react";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import classNames from "classnames";
import Icon from "../icons/icon/Icon";

export interface CheckboxProps {
  ariaLabel?: string;
  checked?: boolean;
  disabled?: boolean;
  id: string;
  label?: string;
  myRef: React.Ref<HTMLButtonElement>;
  name: string;
  onCheckedChange?: (checked: boolean) => void;
  onBlur?: () => void;
  required?: boolean;
  testId?: string;
}

const Checkbox = ({
  ariaLabel,
  checked,
  disabled = false,
  id = "",
  myRef,
  name = "",
  onCheckedChange,
  onBlur,
  required,
  testId,
}: CheckboxProps) => (
  <RadixCheckbox.Root
    className={classNames(
      "tw-flex tw-aspect-square tw-h-5 tw-w-5 tw-items-center tw-justify-center",
      "tw-cursor-pointer tw-rounded-md tw-border tw-border-gray-300 tw-bg-white tw-outline-none",
      "data-[state='checked']:tw-border-blue-600 data-[state='checked']:tw-bg-blue-600",
      "hover:tw-border-gray-400 hover:data-[state='checked']:tw-border-gray-400",
      "focus:!tw-shadow-none",
      "focus-visible:!tw-outline focus-visible:!tw-outline-2 focus-visible:!tw-outline-offset-2 focus-visible:!tw-outline-brand-200",
      "disabled:tw-cursor-not-allowed disabled:tw-border-gray-300 disabled:tw-bg-gray-100 disabled:data-[state='checked']:tw-border-gray-300 disabled:data-[state='checked']:tw-bg-gray-100",
    )}
    aria-label={ariaLabel}
    checked={checked}
    disabled={disabled}
    id={id}
    name={name}
    onCheckedChange={onCheckedChange}
    onBlur={onBlur}
    ref={myRef}
    required={required}
    data-testid={testId}
  >
    <RadixCheckbox.Indicator className="tw-flex tw-items-start tw-justify-center">
      <Icon type="CheckIcon" classes="tw-text-white" size="sm" />
    </RadixCheckbox.Indicator>
  </RadixCheckbox.Root>
);

export default Checkbox;
