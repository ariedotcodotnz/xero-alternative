import React, { useMemo } from "react";
import classNames from "classnames";
import * as RadixSelect from "@radix-ui/react-select";
import Icon from "../icons/icon/Icon";
// import "./styles.scss";

export type SelectOptionType = {
  /*
   * The value that uses to store in database
   */
  value: string;
  /*
   * The actual text that display in the select menu
   */
  name: string;
  /*
   * Is the value available to be selected
   */
  disabled?: boolean;
};

interface iSelect {
  disabled?: boolean;
  hideLabel?: boolean;
  id: string;
  invalidText?: string;
  label: string;
  name: string;
  onBlur?: () => void;
  onChange: (value: string) => void;
  onClear?: () => void;
  options: SelectOptionType[];
  placeholder?: string;
  required?: boolean;
  selectedValue?: string;
}

const getSelectedName = (options: SelectOptionType[], selectedText: string) => {
  const index = options.findIndex(({ value }) => selectedText === value);

  if (index >= 0) return options[index].name;

  return "";
};

const Select = ({
  disabled = false,
  hideLabel = false,
  id,
  invalidText = "",
  label,
  name,
  onBlur,
  onChange,
  onClear,
  options,
  placeholder = "Select an option",
  required = false,
  selectedValue = "",
}: iSelect) => {
  const EMPTY_STRING_PLACEHOLDER = useMemo(() => crypto.randomUUID(), []);
  const TEMPORARY_ID = useMemo(() => crypto.randomUUID(), []);

  const handleValueChange = (value: string) => {
    let actualValue = value;

    if (value === EMPTY_STRING_PLACEHOLDER) {
      actualValue = "";
    }

    onChange(actualValue);
  };

  const augmentedOptions = useMemo(
    () =>
      options.map((option) => ({
        ...option,
        value: option.value || EMPTY_STRING_PLACEHOLDER,
      })),
    [options],
  );

  const augmentedSelection = selectedValue || EMPTY_STRING_PLACEHOLDER;

  return (
    <div className="hui-select">
      <label
        htmlFor={id}
        className={classNames("hnry-label", { "tw-sr-only": hideLabel, "hnry-label--required": required })}
      >
        {label}
      </label>
      <div className="hui-select__wrapper">
        <RadixSelect.Root
          disabled={disabled}
          onValueChange={handleValueChange}
          value={augmentedSelection}
          required={required}
          name={name}
        >
          <RadixSelect.Trigger
            className="hui-select__button tw-flex tw-items-center"
            aria-labelledby={TEMPORARY_ID}
            id={id}
            onBlur={onBlur}
          >
            <RadixSelect.Value asChild>
              <span
                className={classNames(
                  "hui-select__label tw-grow tw-pointer-events-none",
                  { "tw-text-gray-400": !selectedValue },
                )}
                id={TEMPORARY_ID}
              >
                {selectedValue
                  ? getSelectedName(options, selectedValue)
                  : placeholder}
              </span>
            </RadixSelect.Value>
            {(!selectedValue || (selectedValue && onClear === undefined)) && (
              <RadixSelect.Icon className="hui-select__icon">
                <Icon type="ChevronDownIcon" classes="!tw-text-gray-700" />
              </RadixSelect.Icon>
            )}
          </RadixSelect.Trigger>
          {selectedValue && onClear !== undefined && (
            <button
              aria-label="Clear selection"
              onClick={onClear}
              type="button"
              className="tw-px-2 tw-mr-2 tw-h-full tw-absolute tw-right-0 tw-top-0"
            >
              <Icon type="XMarkIcon" classes="!tw-text-gray-700" size="base" />
              <span className="tw-sr-only">Clear selection</span>
            </button>
          )}

          <RadixSelect.Portal>
            <RadixSelect.Content className="hui-select__options">
              <RadixSelect.ScrollUpButton />
              <RadixSelect.Viewport>
                {augmentedOptions.map((option) => (
                  <RadixSelect.Item
                    key={`id-option-${option.value}`}
                    value={option.value}
                    className="hui-select__option "
                    disabled={option.disabled}
                  >
                    <RadixSelect.ItemText>{option.name}</RadixSelect.ItemText>
                    {/* <RadixSelect.ItemIndicator /> */}
                  </RadixSelect.Item>
                ))}
              </RadixSelect.Viewport>
              <RadixSelect.ScrollDownButton />
              <RadixSelect.Arrow />
            </RadixSelect.Content>
          </RadixSelect.Portal>
        </RadixSelect.Root>
        {invalidText.length > 0 && (
          <p className="tw-mt-2 tw-text-sm tw-text-red-600">{invalidText}</p>
        )}
        {/* Clutch to allow empty values to be passed. */}
        <input type="hidden" name={name} value={selectedValue} />
      </div>
    </div>
  );
};

export default Select;
