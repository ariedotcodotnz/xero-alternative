import React from "react";
import Select from "../_atoms/select/Select";
import Tooltip from "../tooltip";
import { ordinalize } from "../utils/general_helpers";
import I18n from "../../utilities/translations";
import { RecurrenceConfig } from "../../types/invoices.type";
import RecurrenceDateBanner from "./RecurrenceDateBanner";

export interface iRecurrenceFields {
  recurrenceConfig: RecurrenceConfig;
  setRecurrenceConfig: (value: RecurrenceConfig) => void;
  containingElementOpen?: boolean;
  invoiceDate?: Date;
}

const ctx = { scope: "invoices.recurrence" };
const INVOICE_MAX_OCCURRENCES = 2

const RecurrencePeriod = ({
  recurrenceConfig,
  setRecurrenceConfig,
}: iRecurrenceFields) => {
  const periodOptions = [
    { name: "Never", value: "never" },
    { name: "Weekly", value: "weekly" },
    { name: "Fortnightly", value: "fortnightly" },
    { name: "Monthly", value: "monthly" },
    { name: "Yearly", value: "annually" },
  ];

  const dailySelectionFrequencies = ["weekly", "fortnightly"];

  const handleRecurrencePeriodChange = (value) => {
    const recurrenceDay =
      dailySelectionFrequencies.includes(value) &&
      dailySelectionFrequencies.includes(recurrenceConfig.recurrencePeriod)
        ? recurrenceConfig.recurrenceDay
        : 1;

    setRecurrenceConfig({
      recurrencePeriod: value,
      recurrenceDay,
      recursIndefinitely: false,
      recurrenceMaxOccurrences: INVOICE_MAX_OCCURRENCES,
    });
  };

  return (
    <div className="tw-inline-flex tw-mr-2 tw-mb-2">
      <Select
        options={periodOptions}
        label="How frequently should sending this invoice recur?"
        hideLabel={true}
        name="invoice[invoice_config_attributes][recurrence_period]"
        id="invoice[invoice_config_attributes][recurrence_period]"
        selectedValue={recurrenceConfig.recurrencePeriod}
        onChange={(value) => handleRecurrencePeriodChange(value)}
      />
    </div>
  );
};

const RecurrenceDay = ({
  recurrenceConfig,
  setRecurrenceConfig,
}: iRecurrenceFields) => {
  const recurrenceDayOptions = () => {
    let options = [];

    if (recurrenceConfig.recurrencePeriod === "monthly") {
      const monthlyDayOptions = new Array(28).fill(0).map((_, index) => {
        const step = index + 1;
        return {
          name: ordinalize(step),
          value: String(step),
        };
      });
      options = [...monthlyDayOptions];
    } else if (recurrenceConfig.recurrencePeriod === "annually") {
      options = [];
    } else {
      // weekly or fortnightly
      options = [
        { name: "Mondays", value: "1" },
        { name: "Tuesdays", value: "2" },
        { name: "Wednesdays", value: "3" },
        { name: "Thursdays", value: "4" },
        { name: "Fridays", value: "5" },
        { name: "Saturdays", value: "6" },
        { name: "Sundays", value: "0" },
      ];
    }

    return options;
  };

  const handleRecurrenceDayChange = (value) => {
    setRecurrenceConfig({
      ...recurrenceConfig,
      recurrenceDay: value,
    });
  };

  return (
    <div className="tw-inline-flex tw-items-center tw-mr-2 tw-mb-2">
      <span
        className="tw-mr-2 tw-mb-0 tw-text-base"
      >
        {recurrenceConfig.recurrencePeriod === "monthly" ? "on the" : "on"}
      </span>
      <Select
        options={recurrenceDayOptions()}
        label="The day on which to send recurring invoices"
        hideLabel={true}
        name="invoice[invoice_config_attributes][recurrence_day]"
        id="invoice[invoice_config_attributes][recurrence_day]"
        selectedValue={recurrenceConfig.recurrenceDay.toString()}
        onChange={(value) => handleRecurrenceDayChange(value)}
      />
    </div>
  );
};

const IndefiniteChoice = ({
  recurrenceConfig,
  setRecurrenceConfig,
}: iRecurrenceFields) => {
  const choiceOptions = [
    { name: "Never", value: "never" },
    { name: "After", value: "after" },
  ];

  const handleIndefiniteChoiceChange = (value) => {
    setRecurrenceConfig({
      ...recurrenceConfig,
      recursIndefinitely: value === "never",
    });
  };

  return (
    <div className="tw-inline-flex tw-items-center tw-mr-2 tw-mb-2">
      <span
        className="tw-mr-2 tw-mb-0 tw-text-base"
      >
        ending
      </span>
      <Select
        options={choiceOptions}
        label="Whether the recurring invoice sequence should end"
        hideLabel={true}
        name="ui[recurrence_ending]"
        id="ui[recurrence_ending]"
        selectedValue={recurrenceConfig.recursIndefinitely ? "never" : "after"}
        onChange={(value) => handleIndefiniteChoiceChange(value)}
      />
    </div>
  );
};

const RecurrenceOccurrence = ({
  recurrenceConfig,
  setRecurrenceConfig,
}: iRecurrenceFields) => {
  const occurrenceCountOptions = new Array(103).fill(0).map((_, index) => {
    const step = String(index + INVOICE_MAX_OCCURRENCES);
    return {
      name: step,
      value: step,
    };
  });

  const handleRecurrenceOccurrenceChange = (value) => {
    setRecurrenceConfig({
      ...recurrenceConfig,
      recurrenceMaxOccurrences: value,
    });
  };

  return (
    <div className="tw-inline-flex tw-items-center tw-mb-2 tw-mr-2">
      <Select
        options={occurrenceCountOptions}
        label="The number of times this invoice should be sent again"
        hideLabel={true}
        name="invoice[invoice_config_attributes][recurrence_max_occurrences]"
        id="invoice[invoice_config_attributes][recurrence_max_occurrences]"
        selectedValue={recurrenceConfig.recurrenceMaxOccurrences.toString()}
        onChange={(value) => handleRecurrenceOccurrenceChange(value)}
      />
      <span className="tw-ml-2 tw-mb-0 tw-text-base">
        occurrence{recurrenceConfig.recurrenceMaxOccurrences.toString() !== "1" ? "s" : ""}
      </span>
    </div>
  );
};

const RecurrenceFields = ({
  recurrenceConfig,
  setRecurrenceConfig,
  containingElementOpen,
  invoiceDate
}: iRecurrenceFields) => {
  const isRecurrence = recurrenceConfig?.recurrencePeriod && recurrenceConfig?.recurrencePeriod !== "never";
  const showRecurrenceDay = ["weekly", "fortnightly", "monthly"].includes(recurrenceConfig?.recurrencePeriod);
  const showRecurrenceOccurrence = recurrenceConfig?.recursIndefinitely === false;

  const shouldBannerDisplay: boolean =
    (containingElementOpen &&
    recurrenceConfig.recurrencePeriod !== "never" &&
    invoiceDate !== null) &&
    isRecurrence;

  return recurrenceConfig ? (
    <div className="sm:tw-col-span-2">
      <span className="hnry-label">
        {I18n.t("dropdown_label", ctx)}
        <Tooltip otherClasses="tw-ml-1.5 !tw-text-gray-300 hover:!tw-text-brand-900 focus:!tw-text-brand-900" text={I18n.t("tooltip_legacy_update", ctx)} link={I18n.t("tooltip_legacy_link", ctx)} />
      </span>
      <div className="tw-flex tw-flex-wrap tw-items-center" data-testid="recurrence-fields">
        <RecurrencePeriod {...{ recurrenceConfig, setRecurrenceConfig }} />
        {isRecurrence && (
          <>
            {showRecurrenceDay && (
              <RecurrenceDay {...{ recurrenceConfig, setRecurrenceConfig }} />
            )}
            <IndefiniteChoice {...{ recurrenceConfig, setRecurrenceConfig }} />
            {showRecurrenceOccurrence && (
              <RecurrenceOccurrence {...{ recurrenceConfig, setRecurrenceConfig }}  />
            )}
          </>
        )}
      </div>
      {shouldBannerDisplay && <RecurrenceDateBanner recurrenceConfig={recurrenceConfig} invoiceDate={invoiceDate} />}
    </div>
  ) : null;
};

export default RecurrenceFields;
