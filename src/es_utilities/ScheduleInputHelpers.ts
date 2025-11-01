import { isAfter, isBefore, startOfDay } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { TimeZone } from "../types/invoices.type";
import { TimeOption } from "../components/invoices/ScheduleInputs";

export const castDateToTimezone = (
  date: Date,
  fromTz: string,
  toTz: string,
) => {
  const dateStringInTimezone = formatInTimeZone(
    date,
    fromTz,
    "yyyy-MM-dd HH:mm:ss",
  );

  return fromZonedTime(dateStringInTimezone.replace(" ", "T"), toTz);
};

/**
 * Returns a date object set to the provided hour on the date in the given timezone
 * @param {Date} date The date to set the hour on, only the date is considered, not the time.
 * @param {TimeZone} tz The timezone object
 * @param {string} hour The hour string in 24h format, with colons, eg. 14:00
 * @return {Date} A date object set to the provided hour in the given timezone
 */
export const setHourOnDayInTimezone = (
  tz: Partial<TimeZone>,
  hour: string,
  date: Date = new Date(),
) => {
  const dateStringInTimezone = formatInTimeZone(
    date,
    tz.tzdataName,
    "yyyy-MM-dd",
  );

  const dateInTimezone = fromZonedTime(
    `${dateStringInTimezone}T${hour}`,
    tz.tzdataName,
  );

  return dateInTimezone;
};

export type TimeDropdownOptions = {
  name: string;
  value: string;
  disabled: boolean;
};

/**
 * Checks if a given date is before another given date.
 * @param {Date} date - The date to check.
 * @param {Date} givenDate - The date to compare against.
 * @param {TimeZone} tz - The timezone to use for date and time calculations.
 * @param {boolean} invert - Invert the comparison.
 * @returns {boolean} - Returns true if the date is before the given date, false otherwise.
 */
export const dateIsBeforeGivenDate = (
  date: Date,
  givenDate: Date,
  tz: TimeZone,
  invert = false,
) => {
  const dateStringTzAgnostic = formatInTimeZone(
    date,
    tz.tzdataName,
    "yyyy-MM-dd",
  );

  const givenDateStringTzAgnostic = formatInTimeZone(
    givenDate,
    tz.tzdataName,
    "yyyy-MM-dd",
  );

  const dateStartInTimezone = startOfDay(
    fromZonedTime(dateStringTzAgnostic, tz.tzdataName),
  );
  const givenDateStartInTimezone = startOfDay(
    fromZonedTime(givenDateStringTzAgnostic, tz.tzdataName),
  );

  return invert
    ? isAfter(dateStartInTimezone, givenDateStartInTimezone)
    : isBefore(dateStartInTimezone, givenDateStartInTimezone);
};

/**
 * Checks if a given date is after another given date.
 * @param date - The date to check.
 * @param givenDate - The date to compare against.
 * @param tz - The time zone to consider when comparing the dates.
 * @returns Returns `true` if the `date` is after the `givenDate`, `false` otherwise.
 */
export const dateIsAfterGivenDate = (
  date: Date,
  givenDate: Date,
  tz: TimeZone,
) => dateIsBeforeGivenDate(date, givenDate, tz, true);

/**
 * Generates an array of time dropdown options based on the selected date and time options.
 * @param tz - The time zone.
 * @param timeOptions - An array of time options in the format [value, name].
 * @param selectedDate - The selected date.
 * @param now - The current date and time (useful to use server time).
 * @returns An array of time dropdown options with name, value, and disabled properties.
 */
export const getTimeDropdownOptions = (
  tz: TimeZone,
  timeOptions: TimeOption[],
  selectedDate: Date,
  now: Date = new Date(),
): TimeDropdownOptions[] => {
  if (!selectedDate || dateIsAfterGivenDate(selectedDate, now, tz)) {
    return timeOptions.map((timeOption) => ({
      name: timeOption[1],
      value: timeOption[0],
      disabled: false,
    }));
  }

  return timeOptions.map((timeOption) => {
    const option = setHourOnDayInTimezone(tz, timeOption[0], selectedDate);

    const isBeforeNow = isBefore(option, now);

    return {
      name: timeOption[1],
      value: timeOption[0],
      disabled: isBeforeNow,
    };
  });
};

/**
 * Checks if the current date and time are still valid based on the provided time options.
 *
 * @param {string} tz - The timezone to use for date and time calculations.
 * @param timeOptions - An array of time options in the format [value, name].
 * @param now - The current date and time (useful to use server time).
 * @returns {boolean} - Returns true if the current date and time are still valid, otherwise returns false.
 */
export const isTodayDateTimesStillValid = (
  tz: TimeZone,
  timeOptions: TimeOption[],
  now: Date = new Date(),
) => {
  const lastTime = setHourOnDayInTimezone(
    tz,
    timeOptions[timeOptions.length - 1][0],
    now,
  );

  return isBefore(now, lastTime);
};

/**
 * Checks if the given options contain a specific time value.
 * @param options - An array of TimeDropdownOptions.
 * @param time - The time value to check.
 * @returns A boolean indicating whether the options contain the specified time.
 */
export const doOptionsContainTime = (
  options: TimeDropdownOptions[],
  time: string,
) => {
  const option = options.find((opt) => opt.value === time);
  return !option?.disabled;
};

export default {
  castDateToTimezone,
  dateIsBeforeGivenDate,
  doOptionsContainTime,
  getTimeDropdownOptions,
  isTodayDateTimesStillValid,
};
