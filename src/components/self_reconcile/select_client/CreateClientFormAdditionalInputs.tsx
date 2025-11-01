import React from "react";
import {
  Control,
  Controller,
  UseFormTrigger,
  UseFormWatch,
} from "react-hook-form";
import Switch from "@hui/_atoms/switch/Switch";
import RadioButtonList from "@hui/_molecules/radio_button_list/RadioButtonList";
import InputWithTooltip from "@hui/_molecules/input_group/InputWithTooltip";
import { CreateClientFormType } from "../types/selfReconcileTypes";
import I18n from "../../../utilities/translations";
import { getUserJurisdictionCode } from "../../../utilities/user_attributes";

export interface CreateClientFormAdditionalInputsProps {
  salesTaxRegistered: boolean;
  control: Control<CreateClientFormType>;
  trigger: UseFormTrigger<CreateClientFormType>;
  watch: UseFormWatch<CreateClientFormType>;
}

const CreateClientFormAdditionalInputs = ({
  salesTaxRegistered = false,
  control,
  trigger,
  watch,
}: CreateClientFormAdditionalInputsProps) => {
  const jurisdictionCode = getUserJurisdictionCode();
  const auUser = jurisdictionCode === "au";

  const ctx = { scope: "clients.form" };

  const hasPriorDeduction = watch("hasPriorDeduction");
  const taxRatePercentage = watch("taxRatePercentage");

  return (
    <>
      {salesTaxRegistered && (
        <div className="tw-mb-4">
          <Controller
            control={control}
            name="clientDeductsSalesTax"
            render={({ field }) => (
              <Switch
                label={I18n.t(
                  "outside_country.sales_tax_registered.true.label",
                  ctx,
                )}
                checked={field.value}
                id="client_deducts_sales_tax"
                onChange={field.onChange}
                className="hnry-label tw-ml-3"
              />
            )}
          />
        </div>
      )}

      {!auUser && (
        <div className="tw-mb-4">
          <label
            className="hnry-label hnry-label--required"
            htmlFor="client_has_prior_deduction_percentage"
          >
            {I18n.t("has_prior_deduction_percentage", ctx)}
          </label>
          <Controller
            control={control}
            name="hasPriorDeduction"
            rules={{ required: true }}
            render={({ field }) => (
              <RadioButtonList
                vertical={false}
                onChange={field.onChange}
                id="client_has_prior_deduction"
                groupLabel="client_has_prior_deduction_percentage_radio_group"
                value={hasPriorDeduction}
                items={[
                  { name: "Yes", value: "true" },
                  { name: "No", value: "false" },
                ]}
              />
            )}
          />
        </div>
      )}

      {!auUser && hasPriorDeduction === "true" && (
        <div className="tw-mb-4 tw-ml-4">
          <Controller
            control={control}
            name="taxRatePercentage"
            rules={{
              required: "Tax rate is required",
              min: {
                value: 9.9,
                message: I18n.t(
                  "prior_deductions.invalid_messages.less_than",
                  ctx,
                ),
              },
              max: {
                value: 45,
                message: I18n.t(
                  "prior_deductions.invalid_messages.greater_than",
                  ctx,
                ),
              },
            }}
            render={({
              field,
              fieldState: { error: taxRatePercentageError },
            }) => (
              <InputWithTooltip
                id="client_tax_rate_percentage"
                label={I18n.t("prior_deductions.percentage_label", ctx)}
                popoverMessage={I18n.t("withholding_tax.tooltip.text", ctx)}
                learnMoreLink={I18n.t("withholding_tax.tooltip.link", ctx)}
                step="0.01"
                type="number"
                rightIcon="%"
                max={taxRatePercentage}
                setValue={(value) => {
                  field.onChange(value);
                  trigger("taxRatePercentage");
                }}
                value={field.value || ""}
                invalid={
                  taxRatePercentageError ? taxRatePercentageError.message : ""
                }
              />
            )}
          />
        </div>
      )}
    </>
  );
};

export default CreateClientFormAdditionalInputs;
