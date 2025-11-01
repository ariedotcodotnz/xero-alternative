import React from "react";
import { RadioGroup as HeadlessUIRadioGroup } from "@headlessui/react";
import classNames from "classnames";

type ButtonDataType = {
  description: string;
  name: string;
  optionId: string;
}

interface iRadioButtonGroup {
  options: ButtonDataType[];
  onChange: (v: string) => void;
  value?: string;
}

const RadioButtonGroup = ({
  options, onChange, value,
}: iRadioButtonGroup) => (
  <HeadlessUIRadioGroup value={value} onChange={onChange}>
    <div className="tw-rounded-md tw-bg-white">
      {options.map(({ name, description, optionId }, index) => (
        <HeadlessUIRadioGroup.Option
          key={`${optionId}-option`}
          value={optionId}
          className={({ checked }) => classNames(
            index === 0 ? "tw-rounded-tl-md tw-rounded-tr-md" : "",
            index === options.length - 1 ? "tw-rounded-bl-md tw-rounded-br-md" : "",
            checked ? "tw-border-blue-500 tw-bg-blue-100" : "tw-border-gray-200",
            "tw-relative tw-flex tw-cursor-pointer tw-border tw-p-4",
          )}
          id={`radio-${optionId}`}
        >
          {({ checked }) => (
            <>
              <span
                className={classNames(
                  checked ? "tw-bg-blue-500" : "",
                  "tw-mt-1 tw-h-4 tw-w-4 tw-shrink-0 tw-cursor-pointer tw-rounded-full tw-border tw-flex tw-items-center tw-justify-center",
                )}
                aria-hidden="true"
              >
                <span className="tw-rounded-full tw-bg-white tw-w-1 tw-h-1" />
              </span>
              <span className="tw-ml-3 tw-flex tw-flex-col">
                <HeadlessUIRadioGroup.Label
                  as="span"
                  className="tw-block tw-text-base tw-font-semibold tw-text-gray-800"
                >
                  {name}
                </HeadlessUIRadioGroup.Label>
                <HeadlessUIRadioGroup.Description
                  as="span"
                  className="tw-pt-1 tw-block tw-text-sm tw-text-700"
                >
                  {description}
                </HeadlessUIRadioGroup.Description>
              </span>
            </>
          )}
        </HeadlessUIRadioGroup.Option>
      ))}
    </div>
  </HeadlessUIRadioGroup>
);

export default RadioButtonGroup;
