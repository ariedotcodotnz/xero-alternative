import React from "react";
import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import classNames from "classnames";

export type RadioButtonListItem = {
  /*
   * The text that display as radio button
   */
  name: string;
  /*
   * The unique value to identify the radio item
   */
  value: string;
};

interface iRadioButtonList {
  id?: string;
  items: RadioButtonListItem[];
  onChange: (arg0: string) => void;
  value: string;
  groupLabel?: string;
  disabled?: boolean;
  /*
   * To stack the radio button items in vertical. If required to stack them in horizontal, set the prop to false
   */
  vertical?: boolean;
  required?: boolean;
}

const RadioButtonList = ({
  id,
  items,
  onChange,
  value,
  groupLabel,
  disabled = false,
  vertical = true,
  required = false,
}: iRadioButtonList) => (
  <RadixRadioGroup.Root
    className={classNames("tw-flex tw-gap-1", { "tw-flex-col": vertical, "tw-flex-row tw-gap-x-8 tw-ml-6": !vertical })}
    aria-label={groupLabel}
    onValueChange={onChange}
    value={value}
    disabled={disabled}
    name={groupLabel}
    id={id}
    required={required}
  >
    {items.map(({ name, value: itemValue }) => (
      <label
        htmlFor={`list-item-${itemValue}`}
        className="tw-py-2 tw-flex tw-gap-4 tw-mb-1"
        key={itemValue}
      >
        <RadixRadioGroup.Item
          className={classNames(
            "tw-bg-white tw-w-5 tw-h-5 tw-rounded-full tw-border tw-border-gray-200 tw-outline-none tw-cursor-pointer",
            "data-[state='checked']:tw-bg-blue-500 data-[state='checked']:tw-border-blue-500",
            "hover:tw-border-gray-400 hover:data-[state='checked']:tw-border-gray-400 tw-aspect-square",
            "focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-2 focus-visible:tw-outline-blue-200",
            "disabled:tw-bg-gray-100 disabled:tw-border-gray-300 disabled:tw-cursor-not-allowed disabled:data-[state='checked']:tw-bg-gray-100",
          )}
          value={itemValue}
          id={`list-item-${itemValue}`}
        >
          <RadixRadioGroup.Indicator
            className={classNames(
              "tw-flex tw-items-center tw-justify-center tw-w-full tw-h-full tw-relative",
              "after:tw-content-[''] after:tw-block after:tw-w-2 after:tw-h-2 after:tw-rounded-[50%] after:tw-bg-white after:data-[disabled]:tw-bg-gray-300",
            )}
          />
        </RadixRadioGroup.Item>

        <span className="tw-text-sm">{name}</span>
      </label>
    ))}
  </RadixRadioGroup.Root>
);

export default RadioButtonList;
