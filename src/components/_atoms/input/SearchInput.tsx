import React from "react";
import classNames from "classnames";
import InputGroup from "./InputGroup";
import Input, { iInput } from "./Input";
import InputRightIcon from "./InputRightIcon";
import Icon from "../icons/icon/Icon";

interface iSearchInput {
  hint?: string;
  id?: string;
  inputGroupClasses?: string;
  inputProps?: iInput;
  label: string;
  labelClasses?: string;
  onBlur?: () => void;
  onFocus?: () => void
  setValue?: (arg0: string) => void;
  showLabel?: boolean;
  value?: string;
}

const SearchInput = ({
  hint,
  id,
  inputGroupClasses,
  inputProps,
  label,
  labelClasses,
  onBlur,
  onFocus,
  setValue,
  showLabel = true,
  value = "",
}: iSearchInput) => {
  const iconColors = "!tw-text-gray-300";

  const handleClear = () => {
    setValue("");
  };

  return (
    <InputGroup
      inputGroupClasses={classNames("search-input", inputGroupClasses)}
    >
      <label
        htmlFor={id}
        className={
          showLabel
            ? classNames(
                "!tw-flex tw-flex-col tw-space-y-1",
                "hnry-label",
                labelClasses,
              )
            : "tw-sr-only"
        }
      >
        {label}
      </label>
      <Input
        {...inputProps}
        inputClasses={classNames("tw-font-normal", inputProps?.inputClasses)}
        setValue={setValue}
        value={value}
        // Prevent input from rendering its own label automatically
        labelRendered={false}
        placeholder={label}
        id={id}
        onBlur={onBlur}
        onFocus={onFocus}
      />

      {value.length === 0 ? (
        <InputRightIcon ariaLabel="Clear text (disabled)">
          <Icon type="MagnifyingGlassIcon" classes={iconColors} />
        </InputRightIcon>
      ) : (
        <InputRightIcon ariaLabel="Clear text" onClick={handleClear}>
          <Icon type="XMarkIcon" classes={iconColors} />
        </InputRightIcon>
      )}
      {hint && (
        <p className="tw-text-sm tw-text-gray-500 tw-font-light tw-mt-1.5">
          {hint}
        </p>
      )}
    </InputGroup>
  );
};

export default SearchInput;
