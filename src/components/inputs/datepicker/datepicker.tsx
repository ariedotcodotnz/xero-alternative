import React, { useState, useRef, useEffect } from "react";
import Calendar from "react-calendar";
import {
  addYears,
  format,
  isAfter,
  isBefore,
  isValid,
  parse,
  subYears,
} from "date-fns";

import classNames from "classnames";
import Cleave from "cleave.js/react";
import {
  useClickOutside,
  useEscapeKey,
  useCustomEventDispatch,
} from "../../utils/Hooks";
import isMobile from "../../../es_utilities/isMobile";
import Icon from "../../_atoms/icons/icon/Icon";
import Tooltip from "../../_atoms/tooltip/Tooltip";
import ClearButton from "../_elements/clear_button";
import CalendarIcon from "../../../../assets/images/icons/calendar.svg";
// Time constants for presets
const TEN_YEARS_FROM_TODAY = addYears(new Date(), 10);
const ELEVEN_YEARS_FROM_TODAY = addYears(new Date(), 11);
const TEN_YEARS_BEFORE_TODAY = subYears(new Date(), 10);
const EIGHTEEN_YEARS_BEFORE_TODAY = subYears(new Date(), 18);

const ONE_HUNDRED_YEARS_FROM_TODAY = addYears(new Date(), 100);
const ONE_HUNDRED_YEARS_BEFORE_TODAY = subYears(new Date(), 100);

export type DatepickerInputProps = {
  autoComplete?: "bday";
  value: string | Date;
  name: string;
  onChange: (value: Date) => void;
  id?: string;
  disabled?: boolean;
};
type presetTypes = "dob" | "uk_dob" | "timeless" | "expiry";
interface DatepickerProps {
  label: string;
  inputProps: DatepickerInputProps;
  latestDate?: Date;
  earliestDate?: Date;
  preset?: presetTypes;
  requiredLabel?: boolean;
  invalidText?: string;
  eventName?: string;
  legacyStyles?: boolean;
  locale?: string;
  tooltipText?: string;
  iosClearButton?: boolean;
  expandUpwards?: boolean;
}

function getEarliestDate(preset, earliestDate) {
  switch (preset) {
    case "dob":
    case "uk_dob":
    case "timeless":
      return ONE_HUNDRED_YEARS_BEFORE_TODAY;
    case "expiry":
      return new Date();
    default:
      return earliestDate ? new Date(earliestDate) : TEN_YEARS_BEFORE_TODAY;
  }
}

function getLatestDate(preset, latestDate) {
  switch (preset) {
    case "dob":
      return new Date();
    case "uk_dob":
      return EIGHTEEN_YEARS_BEFORE_TODAY;
    case "timeless":
      return ONE_HUNDRED_YEARS_FROM_TODAY;
    case "expiry":
      return ELEVEN_YEARS_FROM_TODAY;
    default:
      return latestDate ? new Date(latestDate) : TEN_YEARS_FROM_TODAY;
  }
}

function getDefaultDate(preset, earliestDate, latestDate) {
  if (
    preset === "dob" ||
    preset === "uk_dob" ||
    preset === "timeless" ||
    preset === "expiry"
  ) {
    return null; // No default date for these presets
  }

  if (earliestDate && isAfter(earliestDate, new Date())) {
    return new Date(earliestDate);
  }

  if (latestDate && isBefore(latestDate, new Date())) {
    return new Date(latestDate);
  }

  return null; // No default date
}

const getDateOrNull = (date: string | Date | null | undefined) => {
  if (date instanceof Date) {
    return date;
  }
  if (date) {
    return new Date(date);
  }
  return null;
};

const Datepicker = ({
  label,
  eventName = "",
  inputProps,
  latestDate,
  earliestDate,
  preset,
  requiredLabel = false,
  invalidText = "",
  legacyStyles = true,
  tooltipText,
  iosClearButton = false,
  expandUpwards = false,
}: DatepickerProps) => {
  const [isDatepickerOpen, setDatepickerOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(getDateOrNull(inputProps.value));
  const [isMobileLabelActive, setMobileLabelActive] = useState<boolean>(false);
  const formattedEarliestDate = getEarliestDate(preset, earliestDate);
  const formattedLatestDate = getLatestDate(preset, latestDate);
  const DatepickerRef = useRef<HTMLInputElement | null>(null);
  const DatepickerInputRef = useRef<Cleave | null>(null);

  // The labels are a bit weird for mobile date inputs
  // set its state explicitly if theres a date selected
  useEffect(() => {
    setMobileLabelActive(!!selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (inputProps.value) {
      setSelectedDate(new Date(inputProps.value));
    } else {
      setSelectedDate(null);
    }
  }, [inputProps.value]);

  // Use the useEscapeKey hook to close the datepicker whenever the escape key is pressed
  useEscapeKey(() => {
    setDatepickerOpen(false);
  });

  useClickOutside(DatepickerRef, (event) => {
    // Since React will unmount/remount different views rather than hiding them,
    // a click on, say, a Month button in the Year view, won't be contained within
    // DatepickerRef, so this Hook will try to close the Datepicker. To fix this, we
    // check if it's parent has a React Calendar class and if it does, we can exempt it.
    if (isMobile) {
      return;
    }
    if (!event.target.parentElement) {
      setDatepickerOpen(false);
      return;
    }
    const parentElementClasses = [...event.target.parentElement.classList];
    if (
      !parentElementClasses.some((className) =>
        className.includes("react-calendar"),
      )
    ) {
      setDatepickerOpen(false);
    }

    // Reset the input value if the date is invalid
    // eslint-disable-next-line xss/no-mixed-html
    const currentInputDateString =
      DatepickerRef.current.querySelector("input").value;

    const currentInputDate = parse(
      currentInputDateString,
      "dd/MM/yyyy",
      new Date(),
    );

    if (currentInputDateString.length !== 10 || !isValid(currentInputDate)) {
      setSelectedDate(null);
    }
  });

  useEffect(() => {
    if (eventName) {
      document.addEventListener(eventName, updateSelectedDate);

      return () => {
        document.removeEventListener(eventName, updateSelectedDate);
      };
    }
  }, []);

  const setDispatchEvent = useCustomEventDispatch({
    eventName: "fieldValueChange",
    detail: {
      type: "datepicker",
      value: selectedDate,
      target: DatepickerRef.current,
    },
  });

  // Respond to a change in selectedDate.
  // - close the calendar if needed
  // - update the selectedDate
  // - fire a change event for external event listeners
  // - call the onChange inputProp if there
  const handleChange = (date, closeOnChange = true) => {
    if (selectedDate && closeOnChange) {
      setDatepickerOpen(false);
    }

    // Inform user that the form has unsaved changes.
    if (selectedDate instanceof Date) {
      const hasChanged = selectedDate === null || !(selectedDate === date);
      if (hasChanged) {
        window.unsaved_changes = true;
      }
    }
    setSelectedDate(date);
    const event = document.createEvent("Event");
    event.initEvent("change", true, true);

    DatepickerInputRef.current.element.dispatchEvent(event);

    if (inputProps.onChange) {
      inputProps.onChange(date);
    }

    setDispatchEvent(true);
  };

  // Respond the a change in the mobile Date input
  const handleMobileChange = (event) => {
    const value = event.target.valueAsDate;
    setSelectedDate(value);
    if (inputProps.onChange) {
      inputProps.onChange(value);
    }

    setDispatchEvent(true);
  };

  const handleMobileClear = () => {
    setSelectedDate(null);
    setDatepickerOpen(false);
    const event = document.createEvent("Event");
    event.initEvent("change", true, true);

    DatepickerInputRef.current.dispatchEvent(event);
    if (inputProps.onChange) {
      inputProps.onChange(null);
    }

    setDispatchEvent(true);
  };

  const handleMobileKeyDown = () => {
    setMobileLabelActive(true);
  };

  // Auto select the current date when focused and if
  // and value hasn't already been selected
  const handleFocus = () => {
    setDatepickerOpen(true);
  };

  // Respond to the clear button being pressed
  // - reset the input
  // - fire the appropriate events
  const handleClear = () => {
    setSelectedDate(null);
    setDatepickerOpen(false);
    const event = document.createEvent("Event");
    event.initEvent("change", true, true);

    DatepickerInputRef.current.element.dispatchEvent(event);
    if (inputProps.onChange) {
      inputProps.onChange(null);
    }

    setDispatchEvent(true);
  };

  // Respond to a user manually typing a date
  // - Allows the user to type in a string. Only accepts valid chars
  // - Parses the string as a Date when it reaches a full Date length (10 chars)
  // - Checks if the new Date is within the specified bounds for min and max Date
  // - Resets the input if the typed date is invalid
  const handleTyping = (event) => {
    const { value } = event.target;
    let typedDate;
    if (value.length !== 10) {
      typedDate = value;
    } else {
      try {
        typedDate = parse(value, "dd/MM/yyyy", new Date());
        if (
          (typedDate === formattedLatestDate ||
            isBefore(typedDate, formattedLatestDate)) &&
          (typedDate === formattedEarliestDate ||
            isAfter(typedDate, formattedEarliestDate))
        ) {
          handleChange(typedDate, false);
        } else {
          typedDate = "";
          handleChange(typedDate, false);
        }
      } catch (error) {
        typedDate = value;
      }
    }
    setSelectedDate(typedDate);
    setDispatchEvent(true);
  };

  // Prevent a form submit when Enter is pressed
  const handleEnter = (event) => {
    const { key } = event;
    if (key === "Enter") {
      event.preventDefault();
      setDatepickerOpen(false);
      DatepickerInputRef.current.element.blur();
    }
  };

  // Destructure out the onChange prop since we don't need to send that to the mobile date input
  const otherInputProps = { ...inputProps };
  delete otherInputProps.onChange;

  // Changes the selected date if a date is passed by a custom event
  const updateSelectedDate = (e) => {
    if (e.detail.expenseDate) {
      const { expenseDate } = e.detail;
      setSelectedDate(new Date(expenseDate));
      setDispatchEvent(true);
    }
  };

  const isDOB = (dateType: presetTypes) =>
    dateType === "dob" || dateType === "uk_dob";

  const mobileComponent = legacyStyles ? (
    <>
      <input
        type="date"
        {...otherInputProps}
        id={otherInputProps.id || otherInputProps.name}
        className={classNames("datepicker-native form-control", {
          required: requiredLabel,
          invalid: invalidText.length,
        })}
        onChange={handleMobileChange}
        onKeyDown={handleMobileKeyDown}
        min={
          formattedEarliestDate instanceof Date
            ? format(formattedEarliestDate, "yyyy-MM-dd")
            : null
        }
        max={
          formattedLatestDate instanceof Date
            ? format(formattedLatestDate, "yyyy-MM-dd")
            : null
        }
        value={
          selectedDate instanceof Date ? format(selectedDate, "yyyy-MM-dd") : ""
        }
        autoComplete={inputProps.autoComplete}
      />
      <label
        className={classNames("hnry-label", {
          active: isMobileLabelActive,
        })}
        htmlFor={otherInputProps.id || otherInputProps.name}
      >
        {label}
      </label>
    </>
  ) : (
    <>
      <label
        className={classNames("hnry-label !tw-flex", {
          active: isMobileLabelActive,
          "hnry-label--required": requiredLabel,
        })}
        htmlFor={otherInputProps.id || otherInputProps.name}
      >
        {label}
        {tooltipText && (
          <span className="tw-ml-1 tw-order-last">
            <Tooltip popoverMessage={tooltipText} size="sm" />
          </span>
        )}
      </label>
      <div className="tw-relative">
        <input
          type="date"
          {...otherInputProps}
          id={otherInputProps.id || otherInputProps.name}
          className={classNames("hnry-input no-bs", {
            "hnry-input--invalid": invalidText.length,
          })}
          onChange={handleMobileChange}
          onKeyDown={handleMobileKeyDown}
          min={
            formattedEarliestDate instanceof Date
              ? format(formattedEarliestDate, "yyyy-MM-dd")
              : null
          }
          max={
            formattedLatestDate instanceof Date
              ? format(formattedLatestDate, "yyyy-MM-dd")
              : null
          }
          value={
            selectedDate instanceof Date ? format(selectedDate, "yyyy-MM-dd") : ""
          }
          autoComplete={inputProps.autoComplete}
          ref={DatepickerInputRef}
        />
        <div className="tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-pr-3">
          {iosClearButton && !!selectedDate && !otherInputProps.disabled && (
            <button type="button" onClick={handleMobileClear} className="tw-p-1">
              <Icon
                type="XCircleIcon"
                classes={classNames({ "!tw-text-red-500": invalidText.length })}
              />
              <span className="tw-sr-only">Clear date</span>
            </button>
          )}
        </div>
      </div>

    </>
  );

  const desktopComponent = legacyStyles ? (
    <>
      <Cleave
        options={{
          date: true,
          delimiter: "/",
          datePattern: ["d", "m", "Y"],
        }}
        type="text"
        ref={DatepickerInputRef}
        onFocus={() => handleFocus()}
        autoComplete={inputProps.autoComplete || "off"}
        className={classNames("form-control", {
          "datepicker-dob-input": isDOB(preset),
          invalid: invalidText.length,
        })}
        {...inputProps}
        id={inputProps.id || inputProps.name}
        onKeyDown={(event) => handleEnter(event)}
        onChange={(event) => handleTyping(event)}
        value={
          selectedDate instanceof Date ? format(selectedDate, "dd/MM/yyyy") : ""
        }
      />
      <label htmlFor={otherInputProps.id || otherInputProps.name}>
        {label}
      </label>
      <ClearButton
        isVisible={!!selectedDate && !otherInputProps.disabled}
        onClick={() => handleClear()}
      />
      {!isDOB ? (
        <img src={CalendarIcon} className="icon" alt="Calendar icon" />
      ) : null}
    </>
  ) : (
    <>
      <label
        htmlFor={otherInputProps.id || otherInputProps.name}
        className={classNames("hnry-label  !tw-flex", {
          "hnry-label--required": requiredLabel,
        })}
      >
        {label}
        {tooltipText && (
          <span className="tw-ml-1 tw-order-last">
            <Tooltip popoverMessage={tooltipText} size="sm" />
          </span>
        )}
      </label>
      <div className="tw-relative">
        <Cleave
          options={{
            date: true,
            delimiter: "/",
            datePattern: ["d", "m", "Y"],
          }}
          type="text"
          ref={DatepickerInputRef}
          onFocus={() => handleFocus()}
          autoComplete={inputProps.autoComplete || "off"}
          className={classNames("hnry-input no-bs", {
            "datepicker-dob-input": isDOB(preset),
            "hnry-input--invalid": invalidText.length,
          })}
          {...inputProps}
          id={inputProps.id || inputProps.name}
          onKeyDown={(event) => handleEnter(event)}
          onChange={(event) => handleTyping(event)}
          value={
            selectedDate instanceof Date
              ? format(selectedDate, "dd/MM/yyyy")
              : ""
          }
        />
        <div className="tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-pr-3">
          {!!selectedDate && !otherInputProps.disabled && (
            <button type="button" onClick={handleClear} className="tw-p-1">
              <Icon
                type="XCircleIcon"
                classes={classNames({ "!tw-text-red-500": invalidText.length })}
              />

              <span className="tw-sr-only">Clear date</span>
            </button>
          )}
          {!isDOB(preset) && (
            <button
              type="button"
              onClick={() => setDatepickerOpen(!isDatepickerOpen)}
              className="tw-p-1"
            >
              <Icon
                type="CalendarDaysIcon"
                classes={classNames({ "!tw-text-red-500": invalidText.length })}
              />

              <span className="tw-sr-only">
                {isDatepickerOpen ? "Close" : "Open"} date picker
              </span>
            </button>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div>
      {isMobile ? (
        mobileComponent
      ) : (
        <div
          className={`datepicker-input${requiredLabel ? " required" : ""} ${expandUpwards ? "relative" : ""}`}
          ref={DatepickerRef}
        >
          {desktopComponent}

          {!isDOB(preset) && isDatepickerOpen && (
            <Calendar
              defaultActiveStartDate={getDefaultDate(
                preset,
                earliestDate,
                latestDate,
              )}
              maxDate={formattedLatestDate}
              minDate={formattedEarliestDate}
              value={selectedDate instanceof Date ? selectedDate : undefined}
              maxDetail="month"
              minDetail="year"
              onChange={(newDate) => handleChange(newDate)}
              className={`${expandUpwards ? "!tw-absolute !tw-bottom-[60%] !tw-top-auto !tw-left-[50%] !tw-transform !tw--translate-x-[50%] " : ""}`}
            />
          )}
        </div>
      )}
      {invalidText.length > 0 && (
        <p className="tw-mt-2 tw-text-sm tw-text-red-600 tw-block">
          {invalidText}
        </p>
      )}
    </div>
  );
};

export default Datepicker;
