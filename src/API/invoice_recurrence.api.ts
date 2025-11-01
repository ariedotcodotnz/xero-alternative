import { get } from "./config/fetch.api";

export type recurrenceDataObject = {
  recurrence_period: string,
  recurrence_day: number,
  start_date: string,
}

type getInvoiceRecurrenceDataType = {
  url: string;
  recurrenceDateObject: recurrenceDataObject;
};

export const fetchInvoiceRecurrenceDate = async ({
  url,
  recurrenceDateObject,
}: getInvoiceRecurrenceDataType) =>
  get(
    `${url}?recurrence_day=${recurrenceDateObject.recurrence_day}&recurrence_period=${recurrenceDateObject.recurrence_period}&start_date=${recurrenceDateObject.start_date}`
  );

export default fetchInvoiceRecurrenceDate;
