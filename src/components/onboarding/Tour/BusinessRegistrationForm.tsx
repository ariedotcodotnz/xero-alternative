import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { useForm, Controller } from "react-hook-form";
import RadioCardGroupWithFeedback from "@hui/_molecules/radio_card_group/RadioCardGroupWithFeedback";
import { CardOptionDataWithFeedback } from "@hui/_molecules/radio_card_group/types";
import Subheading from "@hui/_atoms/subheading/Subheading";
import Paragraph from "@hui/_atoms/paragraph/Paragraph";
import {
  businessRegistrationDto,
  postBusinessRegistration,
} from "../../../API/onboarding/business_registrations.api";
import handleError from "../../../API/utils/handleError";
import convertCamelToSnakeCase from "../../../utilities/case-conversions/snakeCase";
import {
  businessRegistrationForm,
  businessRegistrationFormWithBoolean,
} from "./Shared/types/onboardingTypes";
import I18n from "../../../utilities/translations";
import FormWrapper from "./Shared/FormWrapper";
import FormBody from "./Shared/FormBody";
import {
  OnboardingTourFormRef,
  useOnboardingTour,
} from "./Shared/context/OnboardingTourContext";

const ctx = { scope: "onboarding.v3.business_registration" };

interface iBusinessRegistrationForm {
  stateUpdate: (...args) => void;
  intercomLink: string;
}

const BusinessRegistrationForm = forwardRef<
  OnboardingTourFormRef,
  iBusinessRegistrationForm
>(({ stateUpdate, intercomLink }, ref) => {
  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
  } = useForm<businessRegistrationForm>({
    mode: "onTouched",
    defaultValues: { hasRegisteredBusiness: null },
  });
  const { setCanSubmitForm, setIsSubmitting } = useOnboardingTour();
  useEffect(() => {
    setCanSubmitForm(isValid);
  }, [isValid, setCanSubmitForm]);

  const onSubmit = async (body: businessRegistrationForm) => {
    try {
      setIsSubmitting(true);
      const formWithBoolean = {
        ...body,
      } as businessRegistrationFormWithBoolean;
      if (body.hasRegisteredBusiness === "true") {
        formWithBoolean.hasRegisteredBusiness = true;
      } else if (body.hasRegisteredBusiness === "false") {
        formWithBoolean.hasRegisteredBusiness = false;
      }
      const formattedRequest = convertCamelToSnakeCase(
        formWithBoolean,
      ) as businessRegistrationDto;

      const res = await postBusinessRegistration(formattedRequest);
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

  const radioCardOptions: CardOptionDataWithFeedback[] = [
    {
      name: "No",
      value: "false",
      feedback: { variant: "info", content: I18n.t("feedback_no", ctx) },
    },
    {
      name: "Yes",
      value: "true",
      feedback: {
        variant: "warning",
        content: (
          <p>
            {I18n.t("feedback_yes", ctx)} <a href={intercomLink}> here</a>.
          </p>
        ),
      },
    },
  ];

  return (
    <>
      <FormWrapper>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="tw-flex tw-flex-1 tw-flex-col tw-overflow-hidden"
        >
          <FormBody>
            <Subheading>{I18n.t("heading", ctx)}</Subheading>
            <Paragraph>{I18n.t("paragraph_1", ctx)}</Paragraph>
            <Controller
              control={control}
              name="hasRegisteredBusiness"
              rules={{ required: "Please select an option" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <RadioCardGroupWithFeedback
                  name={"hasRegisteredBusiness"}
                  cardOptions={radioCardOptions}
                  onBlur={onBlur}
                  value={value}
                  setValue={onChange}
                  required={false}
                />
              )}
            />
            {errors?.hasRegisteredBusiness && (
              <span className="tw-text-sm tw-text-red-600">
                {errors.hasRegisteredBusiness.message}
              </span>
            )}
          </FormBody>
        </form>
      </FormWrapper>
    </>
  );
});

BusinessRegistrationForm.displayName = "BusinessRegistrationForm";

export default BusinessRegistrationForm;
