import React, { useEffect, useState } from "react";
import Alert from "@hui/_molecules/alert/Alert";
import { format } from "date-fns";
import { RecurrenceConfig } from "../../types/invoices.type";
import { fetchInvoiceRecurrenceDate } from "../../API/invoice_recurrence.api";

export interface iRecurrenceDateBanner {
  recurrenceConfig: RecurrenceConfig;
  invoiceDate: Date;
}

const INVOICE_RECURRENCE_URL = "/api/invoice_recurrence";

const RecurrenceDateBanner = ({
  recurrenceConfig,
  invoiceDate,
}: iRecurrenceDateBanner) => {
  const [recurrenceDate, setReccurenceDate] = useState(new Date());
  const dateCanBeGenerated = invoiceDate >= new Date(new Date().setHours(0,0,0,0));
  
  useEffect(() => {
    if (dateCanBeGenerated) {
      const dataObject = {
        recurrence_period: recurrenceConfig.recurrencePeriod,
        recurrence_day: recurrenceConfig.recurrenceDay,
        start_date: invoiceDate.toISOString(),
      };
      const fetchAndSetRecurrenceDate = async () => {
        const response = await fetchInvoiceRecurrenceDate({
          url: INVOICE_RECURRENCE_URL,
          recurrenceDateObject: dataObject,
        });
        if (response.data !== undefined) {
          setReccurenceDate(response.data);
        } else {
          setReccurenceDate(new Date());
        }
      };
      fetchAndSetRecurrenceDate();
    } else {
      setReccurenceDate(new Date());
    }
  }, [recurrenceConfig, invoiceDate, dateCanBeGenerated]);

  const generateBannerText = () => {
    const { recurrencePeriod, recursIndefinitely, recurrenceMaxOccurrences } =
      recurrenceConfig;

    const periodMap = {
      weekly: "week",
      fortnightly: "2 weeks",
      monthly: "month",
      annually: "year",
    };

    const recurrencePeriodWord = periodMap[recurrencePeriod] || "";
    const recurrenceCount = recurrenceMaxOccurrences - 1;

    const isMultipleRecurrences =
      recurrenceMaxOccurrences > 2 || recursIndefinitely;

    const recurrencePhrase = recursIndefinitely
      ? "."
      : ` for ${recurrenceCount} ${
        recurrenceCount === 1 ? "recurrence" : "recurrences"
      }.`;

    const recurrenceInstanceWord = isMultipleRecurrences ? "first" : "only";

    const recurringPhrase = isMultipleRecurrences
      ? `, and every ${recurrencePeriodWord} thereafter${recurrencePhrase}`
      : ".";

    const recurrenceYear =
      recurrencePeriod === "annually"
        ? ` ${format(recurrenceDate, "yyyy")}`
        : "";

    const recurrenceDateFormatted = format(recurrenceDate, "eeee do MMMM");
    const text = `The ${recurrenceInstanceWord} recurrence of this invoice will be sent on ${recurrenceDateFormatted}${recurrenceYear}${recurringPhrase}`;

    return text;
  };

  return (
    <div className="sm:tw-col-span-2">
      <Alert variant={dateCanBeGenerated ? "info" : "warning"} title="Heads up!">
        <p>
          {dateCanBeGenerated
            ? generateBannerText()
            : "Please select today or a future date."}
        </p>
      </Alert>
    </div>
  );
};

export default RecurrenceDateBanner;
