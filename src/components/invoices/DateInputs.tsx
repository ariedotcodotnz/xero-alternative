import React, { useEffect } from "react";
import Datepicker, {
  DatepickerInputProps,
} from "../inputs/datepicker/datepicker";
import I18n from "../../utilities/translations";
import { SetDate } from "../../types/invoices.type";

interface iDateBlock extends DatepickerInputProps {
  label: string;
  requiredLabel?: boolean;
  tooltipText?: string;
  invalidText?: string;
}

interface iDateInputs {
  invoiceDate: Date;
  setInvoiceDate: SetDate;

  dueDate: Date;
  setDueDate: SetDate;

  startDate: Date;
  setStartDate: SetDate;

  endDate: Date;
  setEndDate: SetDate;

  periodDateInvalidText: string;
  setPeriodDateInvalidText: (value: string) => void;

  invoiceDateInvalidText?: string;
  setInvoiceDateInvalidText?: (value: string) => void;

  dueDateInvalidText?: string;
  setDueDateInvalidText?: (value: string) => void;
}

export const DateBlock = ({ label, requiredLabel, tooltipText, invalidText, ...inputProps }: iDateBlock) => (
  <Datepicker legacyStyles={false} {...{ label, requiredLabel, tooltipText, invalidText, inputProps }} />
);

const formCtx = { scope: "invoices.form" };
const invalidCtx = { scope: "invoices.invalid" };

const DateInputs = ({
  invoiceDate,
  setInvoiceDate,
  invoiceDateInvalidText,
  setInvoiceDateInvalidText,
  dueDate,
  setDueDate,
  dueDateInvalidText,
  setDueDateInvalidText,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  periodDateInvalidText,
  setPeriodDateInvalidText
}: iDateInputs) => {

  const checkInvoiceDateValidity = (date: Date) => date == null || date.toString() === "" ? setInvoiceDateInvalidText(I18n.t("no_invoice_date", invalidCtx)) : setInvoiceDateInvalidText("");
  const checkDueDateValidity = (date: Date) => date == null || date.toString() === "" ? setDueDateInvalidText(I18n.t("no_due_date", invalidCtx)) : setDueDateInvalidText("");

  useEffect(() => {
    checkInvoiceDateValidity(invoiceDate);
  }, [invoiceDate]);

  useEffect(() => {
    checkDueDateValidity(dueDate);
  }, [dueDate]);

  const checkStartDateAgainstEndDate = (startDate, endDate) => {
    if (startDate !== null && endDate !== null && startDate > endDate) {
      setPeriodDateInvalidText(I18n.t("invoices.invalid.end_date_before_start_date"));
    } else {
      setPeriodDateInvalidText("");
    }
  }

  useEffect(() => {
    checkStartDateAgainstEndDate(startDate, endDate)
  }, [startDate, endDate])

  useEffect(() => {
    checkInvoiceDateValidity(invoiceDate);
    checkDueDateValidity(dueDate);
    checkStartDateAgainstEndDate(startDate, endDate)
  }, [])

  return (
    <>
      <DateBlock
        label={I18n.t("invoice_date", formCtx)}
        value={invoiceDate}
        name="invoice[invoice_date]"
        onChange={(date) => setInvoiceDate(date)}
        requiredLabel={true}
        invalidText={invoiceDateInvalidText}
      />
      <DateBlock
        label={I18n.t("due_date", formCtx)}
        value={dueDate}
        name="invoice[due_date]"
        onChange={(date) => setDueDate(date)}
        requiredLabel={true}
        invalidText={dueDateInvalidText}
      />

      <DateBlock
        label={I18n.t("period_start_date", formCtx)}
        value={startDate}
        name="invoice[period_start_date]"
        onChange={(date) => setStartDate(date)}
        tooltipText={I18n.t("start_date", formCtx)}
      />
      <DateBlock
        label={I18n.t("period_end_date", formCtx)}
        value={endDate}
        name="invoice[period_end_date]"
        onChange={(date) => setEndDate(date)}
        invalidText={periodDateInvalidText}
        tooltipText={I18n.t("end_date", formCtx)}
      />
    </>
  )
};

export default DateInputs;
