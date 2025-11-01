import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { Controller, useForm } from "react-hook-form";
import InputPrice from "@hui/_atoms/input/InputPrice";
import Subheading from "@hui/_atoms/subheading/Subheading";
import Paragraph from "@hui/_atoms/paragraph/Paragraph";
import convertCamelToSnakeCase from "../../../utilities/case-conversions/snakeCase";
import I18n from "../../../utilities/translations";
import { selfEmployedEstimateForm } from "./Shared/types/onboardingTypes";
import {
  postSelfEmployedEstimate,
  selfEmployedEstimateDto,
} from "../../../API/onboarding/self_employed_estimate.api";
import handleError from "../../../API/utils/handleError";
import FormWrapper from "./Shared/FormWrapper";
import FormBody from "./Shared/FormBody";
import {
  OnboardingTourFormRef,
  useOnboardingTour,
} from "./Shared/context/OnboardingTourContext";

const ctx = { scope: "onboarding.v3.self_employed_estimate" };

interface businessRegistrationForm {
  stateUpdate: (...args) => void;
  financialYearStart: string;
  financialYearEnd: string;
}

const SelfEmployedEstimateForm = forwardRef<
  OnboardingTourFormRef,
  businessRegistrationForm
>(({ stateUpdate, financialYearStart, financialYearEnd }, ref) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<selfEmployedEstimateForm>({ mode: "onTouched" });
  const { currencySymbol } = window.Hnry.User.jurisdiction;
  const { setCanSubmitForm, setSecondaryBtnName, setIsSubmitting } =
    useOnboardingTour();

  useEffect(() => {
    setSecondaryBtnName(null);
  }, [setSecondaryBtnName]);

  useEffect(() => {
    setCanSubmitForm(isValid);
  }, [isValid, setCanSubmitForm]);

  const onSubmit = async (body: selfEmployedEstimateForm) => {
    try {
      setIsSubmitting(true);
      const formattedRequest = convertCamelToSnakeCase(
        body,
      ) as selfEmployedEstimateDto;
      const res = await postSelfEmployedEstimate(formattedRequest);
      if (res.status === "ok") {
        stateUpdate(res.data.state);
      } else {
        handleError(res);
      }
    } catch (err) {
      toastr.error("Something went wrong, please try again");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  useImperativeHandle(ref, () => ({
    submitForm: () => handleSubmit(onSubmit)(), // Expose the submit function
  }));

  return (
    <>
      <FormWrapper>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="tw-flex tw-flex-1 tw-flex-col tw-overflow-hidden"
        >
          <FormBody>
            <Subheading>{I18n.t("paragraph_1", ctx)}</Subheading>
            <Paragraph>
              <>
                {I18n.t("paragraph_2", ctx)}
                <span className="tw-font-semibold">
                  {" "}
                  {I18n.t("paragraph_3", ctx)}{" "}
                </span>
                {I18n.t("paragraph_4", {
                  financial_year: `${financialYearStart} and ${financialYearEnd}`,
                  ...ctx,
                })}
              </>
            </Paragraph>
            <div>
              <Controller
                control={control}
                name="selfEmployedIncome"
                rules={{
                  required: I18n.t("warnings.required", ctx),
                  min: {
                    value: 0.01,
                    message: I18n.t("warnings.min", ctx),
                  },
                }}
                render={({ field: { onChange, onBlur, name } }) => (
                  <InputPrice
                    onChange={onChange}
                    onBlur={onBlur}
                    currencySign={currencySymbol}
                    label={I18n.t("label", ctx)}
                    invalid={errors?.selfEmployedIncome?.message}
                    value={""}
                    placeholder="50,000"
                    name={name}
                    requiredIconOnly={true}
                  />
                )}
              />
            </div>
          </FormBody>
        </form>
      </FormWrapper>
    </>
  );
});

SelfEmployedEstimateForm.displayName = "SelfEmployedEstimateForm";
export default SelfEmployedEstimateForm;
