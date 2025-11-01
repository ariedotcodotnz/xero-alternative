import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { useForm, Controller } from "react-hook-form";
import Subheading from "@hui/_atoms/subheading/Subheading";
import Paragraph from "@hui/_atoms/paragraph/Paragraph";
import Combobox from "../../_molecules/combobox/Combobox";
import {
  postVerifyIdentityBasicDetails,
  verifyIdentityBasicDetailsDto,
} from "../../../API/onboarding/verify_identity_basic_details.api";
import { handleHashedError } from "../../../API/utils/handleError";
import convertCamelToSnakeCase from "../../../utilities/case-conversions/snakeCase";
import {
  iVerifyIdentityBasicDetailsForm,
  verifyIdentityBasicDetailsForm,
} from "./Shared/types/onboardingTypes";
import I18n from "../../../utilities/translations";
import FormWrapper from "./Shared/FormWrapper";
import FormBody from "./Shared/FormBody";
import getCountries from "./utils/helpers";

import {
  OnboardingTourFormRef,
  useOnboardingTour,
} from "./Shared/context/OnboardingTourContext";

const ctx = { scope: "onboarding.v3.verify_identity_basic_details" };

const VerifyIdentityBasicDetailsForm = forwardRef<
  OnboardingTourFormRef,
  iVerifyIdentityBasicDetailsForm
>(({ stateUpdate }, ref) => {
  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
  } = useForm<verifyIdentityBasicDetailsForm>({
    defaultValues: { countryOfBirth: null, nationality: null },
  });
  const countryList = getCountries();
  const { setCanSubmitForm, setIsSubmitting } = useOnboardingTour();

  useEffect(() => {
    setCanSubmitForm(isValid);
  }, [isValid, setCanSubmitForm]);

  const onSubmit = async (body: verifyIdentityBasicDetailsForm) => {
    try {
      setIsSubmitting(true);
      const formattedRequest = convertCamelToSnakeCase(
        body,
      ) as verifyIdentityBasicDetailsDto;
      const res = await postVerifyIdentityBasicDetails(formattedRequest);
      if (res.status === "ok") {
        stateUpdate(res.data.state);
      } else {
        handleHashedError(res);
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
      <FormWrapper classes="tw-h-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="tw-flex tw-flex-1 tw-flex-col tw-overflow-hidden"
        >
          <FormBody>
            <Subheading>{I18n.t("heading", ctx)}</Subheading>
            <Paragraph>{I18n.t("description", ctx)}</Paragraph>
            <div className="align-items-center justify-content-center tw-mb-6">
              <Controller
                control={control}
                name="countryOfBirth"
                rules={{ required: I18n.t("required.country_of_birth", ctx) }}
                render={({ field: { onChange, value } }) => (
                  <Combobox
                    name={"countryOfBirth"}
                    entries={countryList}
                    selectedValue={value}
                    setSelectedValue={onChange}
                    legacyStyles={false}
                    label={I18n.t("labels.country_of_birth", ctx)}
                    id={"countryOfBirthCombobox"}
                    openMenuOnFocus={true}
                    placeholder={"Start typing to search"}
                    requiredIconOnly={true}
                  />
                )}
              />
              {errors?.countryOfBirth && (
                <span className="tw-text-sm tw-text-red-600">
                  {errors.countryOfBirth.message}
                </span>
              )}
            </div>
            <div className="align-items-center justify-content-center">
              <Controller
                control={control}
                name="nationality"
                rules={{ required: I18n.t("required.nationality", ctx) }}
                render={({ field: { onChange, value } }) => (
                  <Combobox
                    name={"nationality"}
                    entries={countryList}
                    selectedValue={value}
                    setSelectedValue={onChange}
                    legacyStyles={false}
                    label={I18n.t("labels.nationality", ctx)}
                    id={"nationalityCombobox"}
                    openMenuOnFocus={true}
                    placeholder={"Start typing to search"}
                    requiredIconOnly={true}
                  />
                )}
              />
              {errors?.nationality && (
                <span className="tw-text-sm tw-text-red-600">
                  {errors.nationality.message}
                </span>
              )}
            </div>
          </FormBody>
        </form>
      </FormWrapper>
    </>
  );
});

VerifyIdentityBasicDetailsForm.displayName = "VerifyIdentityBasicDetailsForm";
export default VerifyIdentityBasicDetailsForm;
