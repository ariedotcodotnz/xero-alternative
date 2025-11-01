import React, { useState, useEffect } from "react";
import InputWithTooltip from "@hui/_molecules/input_group/InputWithTooltip";
import Input from "@hui/_atoms/input/Input";
import RadioButtonList from "@hui/_molecules/radio_button_list/RadioButtonList";
import Switch from "@hui/_atoms/switch/Switch";
import Alert from "@hui/_molecules/alert/Alert";
import I18n from "../../../utilities/translations";
import containsInvalidEmail from "../../../es_utilities/emailAddressValidator";

interface iCreateClientForm {
  formRef?: React.RefObject<HTMLFormElement> | null;
  hasClients: boolean;
  model: "invoice" | "quote";
  setDisabledSubmit: (boolean) => void;
  salesTaxRegistered: boolean;
  showSelectClient: boolean;
}

const ctx = { scope: "clients.form" };

const CreateClientForm = ({
  formRef,
  hasClients,
  model,
  setDisabledSubmit,
  salesTaxRegistered,
  showSelectClient,
}: iCreateClientForm) => {
  const [gstType, setGstType] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [invalidEmail, setInvalidEmail] = useState("");
  const [hasPriorDeduction, setHasPriorDeduction] = useState("");
  const [priorDeductionPercentage, setPriorDeductionPercentage] = useState("");
  const [invalidPriorDeductionPercentage, setInvalidPriorDeductionPercentage] = useState("");

  const { currencyCode, code: jurisdictionCode } = window.Hnry.User.jurisdiction;
  const isAu = jurisdictionCode === "au";
  const csrfToken: HTMLMetaElement | undefined = document.querySelector("meta[name='csrf-token']");

  useEffect(() => {
    if (!showSelectClient && formRef.current) {
      setDisabledSubmit(!formRef.current.checkValidity() || invalidPriorDeductionPercentage.length > 0 || invalidEmail.length > 0);
    }
  }, [
    clientEmail,
    clientName,
    formRef,
    hasPriorDeduction,
    invalidEmail,
    invalidPriorDeductionPercentage,
    priorDeductionPercentage,
    setDisabledSubmit,
    showSelectClient,
  ]);

  useEffect(() => {
    if (showSelectClient) {
      setClientEmail("");
      setClientName("");
      setHasPriorDeduction("");
      setPriorDeductionPercentage("");
      setGstType(false);
    }
  }, [showSelectClient]);

  const handlePriorDeductionPercentageChange = (value) => {
    setPriorDeductionPercentage(value);

    if (value && Number(value) < 9.9) {
      setInvalidPriorDeductionPercentage(I18n.t("prior_deductions.invalid_messages.less_than", ctx));
    } else if (value && Number(value) > 45) {
      setInvalidPriorDeductionPercentage(I18n.t("prior_deductions.invalid_messages.greater_than", ctx));
    } else {
      setInvalidPriorDeductionPercentage("");
    }
  }

  const handleEmailBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (containsInvalidEmail(value)) {
      setInvalidEmail(I18n.t("invalid_billing_email", ctx));
    } else {
      setInvalidEmail("");
    }
  }

  return (
    <>
      {!hasClients && (
        <Alert title={I18n.t("invoice_quotes.create_client_modal.title")}>
          <p className="tw-text-sm">{I18n.t("invoice_quotes.create_client_modal.paragraph")}</p>
        </Alert>
      )}
      <form
        ref={formRef}
        data-remote="true"
        method="POST"
        action="/clients"
      >
        <input type="hidden" name="authenticity_token" value={csrfToken?.content} autoComplete="off" />
        <input type="hidden" name="client[currency_code]" value={currencyCode} autoComplete="off" />
        <input type="hidden" name="client[invoice_client_selected]" value="true" autoComplete="off" />
        <input type="hidden" name="create_flow" value={`create_client_from_${model}`} autoComplete="off" />
        <div className="tw-flex tw-flex-col">
          <div className="tw-mb-4">
            <Input
              name="client[organisation_name]"
              id="client_organisation_name"
              label={I18n.t("mobile.organisation_name", ctx)}
              value={clientName}
              setValue={(value) => setClientName(value)}
              required
            />
          </div>
          <div className="tw-mb-4">
            <InputWithTooltip
              name="client[billing_email]"
              id="client_billing_email"
              label={I18n.t("mobile.billing_email", ctx)}
              value={clientEmail}
              setValue={(value) => setClientEmail(value)}
              onBlur={handleEmailBlur}
              type="text"
              popoverMessage={I18n.t("multiple_email_entry", ctx)}
              required={hasClients}
              invalid={invalidEmail}
            />
          </div>
          {salesTaxRegistered ? (
            <div className="tw-mb-4">
              <Switch
                label={I18n.t("outside_country.sales_tax_registered.true.label", ctx)}
                name="client[gst_type]"
                id="client_gst_type"
                onChange={()=> setGstType(!gstType)}
                checked={gstType}
              />
              <input type="hidden" value={gstType ? "ZERO" : ""} name="client[gst_type]" />
            </div>
          ) : <input type="hidden" value="" name="client[gst_type]" />}
          {isAu ? <input type="hidden" value="false" name="client[has_prior_deduction_percentage]" /> : (
            <>
              <label className="hnry-label hnry-label--required" htmlFor="client_has_prior_deduction_percentage">
                {I18n.t("has_prior_deduction_percentage", ctx)}
              </label>
              <RadioButtonList
                items={[
                  { name: "Yes", value: "true" },
                  { name: "No", value: "false" },
                ]}
                id="client_has_prior_deduction_percentage"
                groupLabel="client[has_prior_deduction_percentage]"
                onChange={value => setHasPriorDeduction(value)}
                value={hasPriorDeduction}
                vertical={false}
                required
              />
              {hasPriorDeduction === "true" && (
                <div className="sm:tw-ml-6">
                  <InputWithTooltip
                    name="client[prior_deduction_percentage]"
                    id="client_prior_deduction_percentage"
                    label={I18n.t("prior_deductions.percentage_label", ctx)}
                    popoverMessage={I18n.t("withholding_tax.tooltip.text", ctx)}
                    learnMoreLink={I18n.t("withholding_tax.tooltip.link", ctx)}
                    step="0.01"
                    type="number"
                    rightIcon="%"
                    max="45"
                    setValue={handlePriorDeductionPercentageChange}
                    value={priorDeductionPercentage}
                    invalid={invalidPriorDeductionPercentage}
                    required
                  />
                </div>
              )}
            </>
          )}
        </div>
      </form>
    </>
  );
}

export default CreateClientForm;
