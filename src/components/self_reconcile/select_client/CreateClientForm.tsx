import React from "react";
import Input from "@hui/_atoms/input/Input";
import { Controller, useForm } from "react-hook-form";
import InputWithTooltip from "@hui/_molecules/input_group/InputWithTooltip";
import containsInvalidEmail from "@hutils/emailAddressValidator";
import { getUserJurisdictionCurrencyCode } from "../../../utilities/user_attributes";
import SelfReconcileButtons from "../SelfReconcileButtons";
import CreateClientFormAdditionalInputs from "./CreateClientFormAdditionalInputs";
import I18n from "../../../utilities/translations";
import { CreateClientFormType } from "../types/selfReconcileTypes";

export interface CreateClientFormProps {
  handleModalProgression: (step: string) => void;
  previous: string;
  resetState: () => void;
  salesTaxRegistered: boolean;
  onSubmit: (formValues: CreateClientFormType) => Promise<void>;
  loading: boolean;
}

const CreateClientForm = ({
  handleModalProgression,
  previous,
  resetState,
  salesTaxRegistered = false,
  onSubmit,
  loading,
}: CreateClientFormProps) => {
  const { control, formState, watch, trigger, handleSubmit } =
    useForm<CreateClientFormType>({
      mode: "onBlur",
      defaultValues: {
        clientDeductsSalesTax: false,
        currencyCode: getUserJurisdictionCurrencyCode(),
      },
    });

  const ctx = { scope: "clients.form" };

  const handleConfirm = async () => {
    handleSubmit(onSubmit)();
  };

  return (
    <form>
      <div className="tw-mb-4">
        <Controller
          control={control}
          name="clientName"
          rules={{ required: "Please enter a Client name" }}
          render={({ field }) => (
            <Input
              label={I18n.t("mobile.organisation_name", ctx)}
              id="client_name"
              setValue={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              value={field.value || ""}
              type="text"
              required
              invalid={
                formState.errors.clientName &&
                formState.errors.clientName.message
              }
            />
          )}
        />
      </div>

      <div className="tw-mb-4">
        <Controller
          control={control}
          name="clientEmail"
          rules={{
            validate: (value) =>
              !containsInvalidEmail(value || "") ||
              I18n.t("invalid_billing_email", ctx),
          }}
          render={({ field, fieldState: { error: clientEmailError } }) => (
            <InputWithTooltip
              label={I18n.t("mobile.billing_email", ctx)}
              id="client_email"
              setValue={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              value={field.value || ""}
              type="text"
              popoverMessage={I18n.t("multiple_email_entry", ctx)}
              invalid={clientEmailError ? clientEmailError.message : ""}
            />
          )}
        />
      </div>

      <div className="tw-mb-4">
        <Controller
          control={control}
          name="currencyCode"
          rules={{ required: true }}
          render={({ field }) => (
            <Input {...field} id="client_currency_code" type="hidden" />
          )}
        />
      </div>

      <CreateClientFormAdditionalInputs
        salesTaxRegistered={salesTaxRegistered}
        control={control}
        trigger={trigger}
        watch={watch}
      />

      <SelfReconcileButtons
        handleConfirm={handleConfirm}
        handleBack={() => {
          resetState();
          handleModalProgression(previous);
        }}
        disabledSubmit={!formState.isValid}
        confirmButton="Next"
        loading={loading}
      />
    </form>
  );
};

export default CreateClientForm;
