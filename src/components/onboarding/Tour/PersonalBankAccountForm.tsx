import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { Controller, useForm } from "react-hook-form";
import Input from "@hui/_atoms/input/Input";
import RadioCardGroup from "@hui/_molecules/radio_card_group/RadioCardGroup";
import COPModal from "@hui/_organisms/cop/COPModal";
import Subheading from "@hui/_atoms/subheading/Subheading";
import Paragraph from "@hui/_atoms/paragraph/Paragraph";
import { createRoot } from "react-dom/client";
import IMask from "imask";
import convertCamelToSnakeCase from "../../../utilities/case-conversions/snakeCase";
import I18n from "../../../utilities/translations"
import { personalBankAccountForm } from "./Shared/types/onboardingTypes";
import { personalBankAccountDto, patchPersonalBankAccount } from "../../../API/onboarding/personal_bank_account.api"
import handleError from "../../../API/utils/handleError";
import FormWrapper from "./Shared/FormWrapper";
import FormBody from "./Shared/FormBody";
import { OnboardingTourFormRef, useOnboardingTour } from "./Shared/context/OnboardingTourContext";

const ctx = { scope: "onboarding.v3.personal_bank_account" };

const maskBranchCode = (value: string, pattern: string) => {
  const masking = IMask.createMask({
    mask: pattern
  });

  masking.resolve(value)
  return masking.value
}

let root
const PersonalBankAccountForm = forwardRef<OnboardingTourFormRef, unknown>((_, ref) => {
  const { control, handleSubmit, formState: { errors, isValid }, setValue, watch } = useForm<personalBankAccountForm>({ mode: "onTouched" });
  const { setCanSubmitForm, setPrimaryBtnName, setSecondaryActionEvent, setSecondaryBtnName, setIsSubmitting } = useOnboardingTour()
  const bankBranchCode = watch("bankAccountNumberBankBranchCode")

  useEffect(() => {
    setCanSubmitForm(isValid)
  }, [isValid, setCanSubmitForm])

  useEffect(() => {
    setPrimaryBtnName("Next")
    setSecondaryActionEvent(null)
    setSecondaryBtnName(null)
  }, [setPrimaryBtnName, setSecondaryActionEvent, setSecondaryBtnName])

  useEffect(() => {
    const maskedValue = maskBranchCode(bankBranchCode || "", I18n.t("global.bank_branch_code_mask"))
    setValue("bankAccountNumberBankBranchCode", maskedValue)
  }, [bankBranchCode, setValue]);

  const onSubmit = async (body: personalBankAccountForm) => {
    try {
      setIsSubmitting(true)
      const formattedRequest = convertCamelToSnakeCase(body) as personalBankAccountDto
      const res = await patchPersonalBankAccount(formattedRequest);
      if (res.status === "ok") {
        root?.unmount()
        const domNode = document.getElementById("cop_submission");
        root = createRoot(domNode);
        root.render(
          <COPModal
            fields={res.data.cop.fields}
            actionName="create financial"
            userId={res.data.cop.user_id}
            submissionMethod="put"
            submissionPath={res.data.cop.submission_path}
            payeeName={res.data.cop.payee_name}
            sortCode={res.data.cop.sort_code}
            accountNumber={res.data.cop.account_number}
            accountType={res.data.cop.account_type}
            recordName="financial_attributes"
            recordAttributes={res.data.cop.record_attributes}
            callBackUrl={Routes.state_update_api_onboarding_personal_bank_accounts_path()}
          />
        );
      }
      else {
        handleError(res)
      }
    } catch (err) {
      toastr.error("Something went wrong, please try again");
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  useImperativeHandle(ref, () => ({
    submitForm: () => handleSubmit(onSubmit)(), // Expose the submit function
  }));

  return (
    <>
      <FormWrapper>
        <form onSubmit={handleSubmit(onSubmit)} className="tw-flex tw-flex-col tw-flex-1 tw-overflow-hidden">
          <FormBody>
            <Subheading>{I18n.t("heading", ctx)}</Subheading>
            <Paragraph>{I18n.t("paragraph_1", ctx)}</Paragraph>
            <div className="tw-mb-6">
              <Controller
                control={control}
                name="bankAccountType"
                rules={{ required: I18n.t("account_type.error", ctx) }}
                render={({ field: { onChange, name, value, onBlur } }) => (
                  <RadioCardGroup
                    name={name}
                    cardOptions={[
                      { name: I18n.t("account_type.personal", ctx), value: "personal" },
                      { name: I18n.t("account_type.business", ctx), value: "business" }
                    ]}
                    value={value}
                    setValue={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              {errors.bankAccountType?.message && <p className="tw-text-sm tw-text-red-600 tw-block">{errors.bankAccountType.message}</p>}
            </div>
            <div className="tw-mb-6">
              <Controller
                control={control}
                name="bankAccountName"
                rules={{ required: I18n.t("account_name.error", ctx) }}
                render={({ field: { onChange, name, value, onBlur } }) => (
                  <Input
                    label={I18n.t("account_name.label", ctx)}
                    setValue={onChange}
                    onBlur={onBlur}
                    name={name}
                    value={value || ""}
                    invalid={errors.bankAccountName && errors.bankAccountName.message}
                    requiredIconOnly={true} />
                )}
              />
            </div>
            <div className="tw-mb-6">
              <Controller
                control={control}
                name="bankAccountNumberBankBranchCode"
                rules={{
                  required: I18n.t("sort_code.error", ctx),
                  pattern: {
                    value: /^[0-9]{2}[-][0-9]{2}[-][0-9]{2}$/,
                    message: I18n.t("sort_code.error", ctx),
                  }
                }}
                render={({ field: { name, value, onBlur, onChange } }) => (
                  <Input
                    label={I18n.t("sort_code.label", ctx)}
                    setValue={onChange}
                    onBlur={onBlur}
                    name={name}
                    value={value || ""}
                    invalid={errors.bankAccountNumberBankBranchCode && errors.bankAccountNumberBankBranchCode.message.toString()}
                    requiredIconOnly={true}
                    inputMode="numeric" />
                )}
              />
            </div>
            <div>
              <Controller
                control={control}
                name="bankAccountNumberAccountNumber"
                rules={{
                  pattern: {
                    value: /^[0-9]{8}$/,
                    message: I18n.t("account_number.error", ctx)
                  },
                  required: I18n.t("account_number.error", ctx),
                }}
                render={({ field: { onChange, name, value, onBlur } }) => (
                  <Input
                    label={I18n.t("account_number.label", ctx)}
                    setValue={onChange}
                    onBlur={onBlur}
                    name={name}
                    value={value || ""}
                    invalid={errors.bankAccountNumberAccountNumber && errors.bankAccountNumberAccountNumber.message.toString()}
                    inputMode="numeric"
                    requiredIconOnly={true}
                    type="number" />
                )}
              />
            </div>
          </FormBody>
        </form>
        <div id="cop_submission"></div>
      </FormWrapper>
    </>
  )
})
PersonalBankAccountForm.displayName = "PersonalBankAccountForm";

export default PersonalBankAccountForm