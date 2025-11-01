import React, { useCallback, useEffect, useState } from "react";
import { add } from "date-fns";

import { useInvoiceQuoteContext } from "../invoice_quote/InvoiceQuoteContext";

import HnryUIAccordion from "../_molecules/accordion/Accordion";
import Alert from "../_molecules/alert/Alert";
import Datepicker from "../inputs/datepicker/datepicker";
import Select from "../_atoms/select/Select";
import DateInputs from "./DateInputs";
import RecurrenceFields from "./RecurrenceFields";

import { iScheduleInputs } from "../../types/invoices.type";
import I18n from "../../utilities/translations";
import {
  castDateToTimezone,
  dateIsAfterGivenDate,
  dateIsBeforeGivenDate,
  doOptionsContainTime,
  getTimeDropdownOptions,
  isTodayDateTimesStillValid,
} from "../../es_utilities/ScheduleInputHelpers";

const BROWSER_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

export type TimeOption = [string, string];

const TIME_OPTIONS: TimeOption[] = [
  ["08:00", "8:00AM"],
  ["09:00", "9:00AM"],
  ["10:00", "10:00AM"],
  ["11:00", "11:00AM"],
  ["12:00", "12:00PM"],
  ["13:00", "1:00PM"],
  ["14:00", "2:00PM"],
  ["15:00", "3:00PM"],
  ["16:00", "4:00PM"],
  ["17:00", "5:00PM"],
  ["18:00", "6:00PM"],
  ["19:00", "7:00PM"],
  ["20:00", "8:00PM"],
];

const INVALID_SCHEDULE_TIME_TEXT =
  "Send time in the past. Update before sending";
const INVALID_SCHEDULE_DATE_TEXT =
  "Send date is in the past. Update before sending";

const ScheduleInputs = ({
  dateInvalidText = "",
  dueDate,
  dueDateInvalidText = "",
  endDate,
  invoiceDate,
  invoiceDateInvalidText = "",
  periodDateInvalidText = "",
  scheduleDate,
  scheduleTime,
  startDate,
  setDateInvalidText,
  setDueDate,
  setDueDateInvalidText,
  setEndDate,
  setInvoiceDate,
  setPeriodDateInvalidText,
  setInvoiceDateInvalidText,
  setScheduleDate,
  setScheduleTime,
  setStartDate,
  setTimeInvalidText,
  timeInvalidText = "",
}: iScheduleInputs) => {
  const {
    timeZone,
    now: Now,
    defaultDueDateDays,
    recurrenceConfig,
    setRecurrenceConfig,
  } = useInvoiceQuoteContext();

  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [disableScheduleTime, setDisableScheduleTime] = useState(!scheduleDate);
  const [validStartDate, setValidStartDate] = useState(Now);
  const [open, setOpen] = useState(false);
  const [datesOpen, setDatesOpen] = useState(false);

  /*
   * Complex state update helpers
   */

  const periodDateInvalid = useCallback(() => {
    setPeriodDateInvalidText(I18n.t("invoices.invalid.end_date_before_start_date"));
  }, [setPeriodDateInvalidText]);

  const scheduleDateInvalid = useCallback(() => {
    setDateInvalidText(INVALID_SCHEDULE_DATE_TEXT);
    setTimeInvalidText("");
  }, [setTimeInvalidText, setDateInvalidText]);

  const scheduleTimeInvalid = useCallback(() => {
    setTimeInvalidText(INVALID_SCHEDULE_TIME_TEXT);
  }, [setTimeInvalidText]);

  const resetInputs = useCallback(() => {
    setDateInvalidText("");
    setTimeInvalidText("");
  }, [setDateInvalidText, setTimeInvalidText]);

  const placeholder =
    scheduleDate && !dateInvalidText ? "Select a time" : "Select a date first";

  /*
   * Effects
   */

  useEffect(() => {
    // if today date already passed the last timeslot of valid send time,
    // set the earliest date to tomorrow (but only if schedule date is not yet fill out)
    if (
      !scheduleDate &&
      !isTodayDateTimesStillValid(timeZone, TIME_OPTIONS, Now)
    ) {
      setValidStartDate(add(Now, { days: 1 }));
    }
  }, [Now, scheduleDate, setValidStartDate, timeZone]);

  useEffect(() => {
    // The accordion need its own 'open' props so that when schedule date is invalid,
    // on 1st render it's open by default
    const disabledWithInvalid = timeInvalidText || dateInvalidText;
    if (!open && (scheduleDate || disabledWithInvalid)) {
      setOpen(true);
    }
  }, [dateInvalidText, open, scheduleDate, timeInvalidText]);

  /*
   * Validations
   */
  useEffect(() => {
    if (scheduleDate || (startDate && endDate)) {
      if (scheduleDate) {
        if (dateIsBeforeGivenDate(scheduleDate, Now, timeZone)) {
          // Before today
          scheduleDateInvalid();
        } else if (dateIsAfterGivenDate(scheduleDate, Now, timeZone)) {
          // After today
          resetInputs();
          setDisableScheduleTime(false);
        } else if (!isTodayDateTimesStillValid(timeZone, TIME_OPTIONS, Now)) {
          // Today but after last time slot
          scheduleDateInvalid();
        } else {
          setDateInvalidText("");
          setDisableScheduleTime(false);

          if (scheduleTime) {
            const currentTimeIsValid = doOptionsContainTime(
              dropdownOptions,
              scheduleTime
            );
            if (currentTimeIsValid) {
              setTimeInvalidText("");
            } else {
              scheduleTimeInvalid();
            }
          } else {
            setTimeInvalidText("");
          }
        }
      }
      if (startDate && endDate) {
        if(startDate > endDate) periodDateInvalid();
      }
    } else {
      resetInputs();
    }
  }, [
    startDate,
    endDate,
    periodDateInvalid,
    scheduleDate,
    scheduleTime,
    dropdownOptions,
    setDateInvalidText,
    setTimeInvalidText,
    scheduleDateInvalid,
    timeZone,
    scheduleTimeInvalid,
    resetInputs,
    Now,
  ]);

  useEffect(() => {
    const timeOptions = getTimeDropdownOptions(
      timeZone,
      TIME_OPTIONS,
      scheduleDate,
      Now
    );

    setDropdownOptions(timeOptions);
  }, [Now, scheduleDate, timeZone]);

  const handleScheduleDateChange = (date) => {
    let castDate = date;
    if (date === null) {
      setScheduleTime("");
      setDisableScheduleTime(true);
    } else {
      castDate = castDateToTimezone(
        date,
        BROWSER_TIMEZONE,
        timeZone.tzdataName
      );

      setDisableScheduleTime(false);

      if (!scheduleTime) {
        const opt = getTimeDropdownOptions(
          timeZone,
          TIME_OPTIONS,
          castDate,
          Now
        ).find((o) => !o.disabled);
        if (opt) {
          setScheduleTime(opt.value);
        }
      }
    }

    setScheduleDate(castDate);

    const newDueDate = add(castDate || invoiceDate, {
      days: defaultDueDateDays,
    });
    setDueDate(newDueDate);
    setOpen(true);
  };

  const handleDatesAccordionChanging = () => {
    setDatesOpen(!datesOpen)
    if (!datesOpen) {
      window.analytics?.track("invoice_create_edit_extra_settings_opened", { menu_selected: "schedule_repeat" });
    }
  }

  const dateToBeUsedForRecurrences = scheduleDate !== null ? scheduleDate : invoiceDate;

  return (
    <HnryUIAccordion
      title="Set Invoice Dates"
      open={datesOpen}
      onOpenChange={handleDatesAccordionChanging}
    >
      <div className="tw-grid tw-gap-x-8 tw-gap-y-4 sm:tw-grid-cols-2">
        <DateInputs
          invoiceDate={invoiceDate}
          setInvoiceDate={setInvoiceDate}
          invoiceDateInvalidText={invoiceDateInvalidText}
          setInvoiceDateInvalidText={setInvoiceDateInvalidText}
          dueDate={dueDate}
          setDueDate={setDueDate}
          dueDateInvalidText={dueDateInvalidText}
          setDueDateInvalidText={setDueDateInvalidText}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          periodDateInvalidText={periodDateInvalidText}
          setPeriodDateInvalidText={setPeriodDateInvalidText}
        />
        <Datepicker
          label={I18n.t("invoices.form.schedule_date")}
          earliestDate={validStartDate}
          requiredLabel={!!scheduleDate}
          invalidText={dateInvalidText}
          inputProps={{
            name: "schedule_date",
            value: scheduleDate,
            onChange: handleScheduleDateChange,
          }}
          legacyStyles={false}
          locale={window.Hnry.User.jurisdiction.locale}
          tooltipText={I18n.t("invoices.form.schedule_date_tooltip")}
        />
        {/* We need this undefined check as the context that provides the state means on initial render the value of scheduleTime is undefined.
        When it is then set on the next render the Select onChange fires with an undefined value.
        This can be tidied when we handle state properly */}
        {typeof scheduleTime !== "undefined" && (
          <Select
            id="schedule-time-dropdown"
            name="schedule_time"
            label={I18n.t("invoices.form.schedule_time")}
            disabled={disableScheduleTime || dateInvalidText.length > 0}
            options={dropdownOptions}
            required={!disableScheduleTime}
            selectedValue={scheduleTime}
            invalidText={timeInvalidText}
            onChange={setScheduleTime}
            placeholder={placeholder}
          />
        )}
        <RecurrenceFields
          recurrenceConfig={recurrenceConfig}
          setRecurrenceConfig={setRecurrenceConfig}
          containingElementOpen={datesOpen}
          invoiceDate={dateToBeUsedForRecurrences}
        />
        {!timeZone.browserInTimezone && (
          <div className="sm:tw-col-span-2">
            <Alert>
              <p className="tw-mb-0">
                Note: Schedule dates and times are in {timeZone.friendlyName}.
              </p>
            </Alert>
          </div>
        )}
      </div>
    </HnryUIAccordion>
  );
};

export default ScheduleInputs;
