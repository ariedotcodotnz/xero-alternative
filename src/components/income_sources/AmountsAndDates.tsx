import React from "react";
import InputPrice from "@hui/_atoms/input/InputPrice";
import Select from "@hui/_atoms/select/Select";
import Datepicker from "@hui/inputs/datepicker/datepicker";
import Switch from "@hui/_atoms/switch/Switch"
import I18n from "../../utilities/translations";
import { getUserJurisdictionCurrencySymbol, getUserJurisdictionLocale } from "../../utilities/user_attributes";
import { iIncomeSource as financialIncomeSource } from "../../types/financialIncomeSource.type";
import { timeZoneType } from "../../types";
import { castDateToTimezone } from "../../es_utilities/ScheduleInputHelpers";

const BROWSER_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;


interface iAmountsAndDates {
  editableIncomeSource: {
    recurringAmount: string;
    startedThisYearSwitchEnabled: boolean;
    startOn: string;
    fixedEndDateSwitchEnabled: boolean;
    endOn: string;
    frequency: string;
  };
  setEditableIncomeSource: (boolean) => void;
  incomeSource: financialIncomeSource;
  currentFy: string;
  timeZone: timeZoneType
}

const AmountsAndDates = ({
  editableIncomeSource,
  setEditableIncomeSource,
  incomeSource,
  currentFy,
  timeZone,
}: iAmountsAndDates) => {

  const ctx = "income_sources.modal";
  const currencySymbol = getUserJurisdictionCurrencySymbol();
  const frequencyOptions = [
    {
      value: "once",
      name: "Once",
    },
    {
      value: "week",
      name: "Week",
    },
    {
      value: "fortnight",
      name: "Fortnight",
    },
    {
      value: "month",
      name: "Month",
    },
    {
      value: "year",
      name: "Year",
    },
  ];

  const handleDateChange = (date) => {
    const castDate = date ? castDateToTimezone(
      date,
      BROWSER_TIMEZONE,
      timeZone.tzdataName
    ) : "";

    return String(castDate)
  };

  return (
    <>
      <div className="tw-pt-4">
        <InputPrice
          placeholder="0.00"
          name="price"
          label={I18n.t("estimate_input_label", { scope: ctx })}
          currencySign={currencySymbol}
          onBlur={(value) => setEditableIncomeSource((prev) => ({ ...prev, recurringAmount: value }))}
          value={Number(editableIncomeSource.recurringAmount).toFixed(2)}
          required={true}
        />
      </div>
      <div className="tw-py-4">
        <Select
          id="frequency-dropdown"
          name="frequency-dropdown"
          options={frequencyOptions}
          onChange={(value) => setEditableIncomeSource((prev) => ({ ...prev, frequency: value}))}
          selectedValue={editableIncomeSource.frequency}
          label={I18n.t("frequency_label", { scope: ctx })}
          placeholder={editableIncomeSource.frequency || "Select..."}
          disabled={false}
          required={true}
        />
      </div>
      {editableIncomeSource.frequency === "once" ?
        <div className="tw-min-w-full sm:tw-min-w-20 mb-4">
          <Datepicker
            label={I18n.t("one_off_date_input_label", { scope: ctx })}
            earliestDate={incomeSource.earliestDate}
            inputProps={{
              name: "one_off_date",
              value: editableIncomeSource.startOn,
              onChange: (date) => setEditableIncomeSource((prev) => ({ ...prev, startOn: handleDateChange(date), endOn: handleDateChange(date) }))
            }}
            requiredLabel={true}
            legacyStyles={false}
            locale={getUserJurisdictionLocale()}
          />
        </div>
        :
        <>
          <div className="tw-mt-4 tw-ml-1">
            <Switch
              checked={editableIncomeSource.startedThisYearSwitchEnabled}
              id="income-source-started-this-year-switch"
              name="income-source-started-this-year-switch"
              label={I18n.t("started_this_year_label", { scope: ctx, currentFy })}
              onChange={() => {
                editableIncomeSource.startedThisYearSwitchEnabled ?
                  setEditableIncomeSource((prev) => ({ ...prev, startOn: "", startedThisYearSwitchEnabled: !editableIncomeSource.startedThisYearSwitchEnabled }))
                :
                  setEditableIncomeSource((prev) => ({ ...prev, startedThisYearSwitchEnabled: !editableIncomeSource.startedThisYearSwitchEnabled }))
              }}
            />
          </div>
          {editableIncomeSource.startedThisYearSwitchEnabled &&
          <div className="tw-mt-6 tw-min-w-full sm:tw-min-w-20">
            <Datepicker
              label={I18n.t("start_date_label", { scope: ctx })}
              earliestDate={incomeSource.earliestDate}
              inputProps={{
                name: "start_date",
                value: editableIncomeSource.startOn,
                onChange: (date) => setEditableIncomeSource((prev) => ({ ...prev, startOn: handleDateChange(date) }))
              }}
              requiredLabel={true}
              legacyStyles={false}
              locale={getUserJurisdictionLocale()}
            />
          </div>
          }
          <div className="tw-mt-4 tw-ml-1">
            <Switch
              checked={editableIncomeSource.fixedEndDateSwitchEnabled}
              id="income-source-fixed-end-date-switch"
              name="income-source-fixed-end-date-switch"
              label={I18n.t("fixed_end_date_label", { scope: ctx })}
              onChange={() => {
                editableIncomeSource.fixedEndDateSwitchEnabled ?
                  setEditableIncomeSource((prev) => ({ ...prev, endOn: "", fixedEndDateSwitchEnabled: !editableIncomeSource.fixedEndDateSwitchEnabled }))
                :
                  setEditableIncomeSource((prev) => ({ ...prev, fixedEndDateSwitchEnabled: !editableIncomeSource.fixedEndDateSwitchEnabled }))
              }}
            />
          </div>
          {editableIncomeSource.fixedEndDateSwitchEnabled &&
          <div className="tw-mt-4 tw-min-w-full sm:tw-min-w-20 tw-mb-6">
            <Datepicker
              label={I18n.t("fixed_end_date_input_label", { scope: ctx })}
              earliestDate={incomeSource.earliestDate}
              inputProps={{
                name: "end_date",
                value: editableIncomeSource.endOn,
                onChange: (date) => setEditableIncomeSource((prev) => ({ ...prev, endOn: handleDateChange(date) }))
              }}
              requiredLabel={true}
              legacyStyles={false}
              locale={getUserJurisdictionLocale()}
            />
          </div>
          }
        </>
      }
    </>
  );
};

export default AmountsAndDates;
