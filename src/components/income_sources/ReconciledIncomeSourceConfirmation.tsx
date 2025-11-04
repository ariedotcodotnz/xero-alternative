import React from "react";
import Cleave from 'cleave-zen';
const { formatNumeral } = Cleave;
import Tooltip from "@hui/_atoms/tooltip/Tooltip";
import I18n from "../../utilities/translations";
import { iIncomeSource as financialIncomeSource } from "../../types/financialIncomeSource.type";
import { timeZoneType } from "../../types";
import AmountsAndDates from "./AmountsAndDates";
import RadioButtonList from "../_molecules/radio_button_list/RadioButtonList";

interface iReconciledIncomeSourceConfirmation {
  editableIncomeSource: {
    continueToEarn: string;
    estimateCorrect: string;
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

const ctx = "income_sources.modal";

const ReconciledIncomeSourceConfirmation = ({
  editableIncomeSource,
  setEditableIncomeSource,
  incomeSource,
  currentFy,
  timeZone
}: iReconciledIncomeSourceConfirmation) => (
  <>
    <div className="list-disc tw-prose-sm tw-prose-grey tw-mt-4 tw-mb-4">
      {I18n.t("continue", { scope: ctx })}
    </div>
    <div className="tw-flex tw-items-center">
      <RadioButtonList
        items={[
          { name: "Yes", value: "true" },
          { name: "No", value: "false" },
        ]}
        id="continue_to_earn"
        groupLabel={I18n.t("continue", { scope: ctx })}
        onChange={(value) => {
          setEditableIncomeSource(prev => ({ ...prev, continueToEarn: value, estimateCorrect: "" }));
        }}
        value={editableIncomeSource.continueToEarn}
        required={true}
        vertical={false}
      />
    </div>
    { (!(editableIncomeSource.continueToEarn === "") || (!incomeSource.needsReview && !editableIncomeSource.continueToEarn)) && ( // estimate text
      <>
        <div className="tw-mt-4 tw-mb-4 tw-flex tw-align-center">
          {editableIncomeSource.continueToEarn === "true" ? I18n.t("estimate_text", { scope: ctx }) : I18n.t("final_declaration.label", { scope: ctx })}
        </div>
        <div className="tw-font-bold tw-ml-6">
          {editableIncomeSource.continueToEarn === "true" ?
            `$${formatNumeral(Number(incomeSource.payorDeclarationForecastForFinancialYear).toFixed(2))}`
            :
            `$${formatNumeral(Number(incomeSource.payorDeclaredAmountForFinancialYear).toFixed(2))}`
          }
          <span className="tw-ml-2">
            <Tooltip popoverMessage={I18n.t("final_declaration.tooltip", { scope: ctx, amount: incomeSource.payorDeclaredAmountForFinancialYear, current_fy: currentFy })} size="sm" />
          </span>
        </div>
      </>
    )}
    { editableIncomeSource.continueToEarn === "true" && (incomeSource.needsReview || incomeSource.payorDeclaredEndDate) && (
      <>
        <div className="list-disc tw-prose-sm tw-prose-grey tw-my-4">
          {I18n.t("estimate_correct", { scope: ctx })}
        </div>
        <div className="tw-flex tw-items-center">
          <RadioButtonList
            items={[
              { name: "Yes", value: "1" },
              { name: "No", value: "0" },
            ]}
            id="financial_income_estimate"
            groupLabel={I18n.t("estimate_correct", { scope: ctx })}
            onChange={(value) => {
              setEditableIncomeSource(prev => ({ ...prev, estimateCorrect: value }))
            }}
            value={editableIncomeSource.estimateCorrect}
            required={true}
            vertical={false}
          />
        </div>
      </>
    )}
    { (editableIncomeSource.estimateCorrect === "0" || (editableIncomeSource.continueToEarn === "true" && !incomeSource.needsReview)) && (
      <div className="tw-mr-1">
        <AmountsAndDates
          editableIncomeSource={editableIncomeSource}
          setEditableIncomeSource={setEditableIncomeSource}
          incomeSource={incomeSource}
          currentFy={currentFy}
          timeZone={timeZone}
        />
      </div>
    )}
  </>
);

export default ReconciledIncomeSourceConfirmation;
