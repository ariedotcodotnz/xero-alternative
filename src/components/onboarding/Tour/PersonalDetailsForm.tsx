import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useForm, Controller } from "react-hook-form";
import Datepicker from "@hui/inputs/datepicker/datepicker";
import Input from "@hui/_atoms/input/Input";
import Subheading from "@hui/_atoms/subheading/Subheading";
import { subYears } from "date-fns";
import handleError from "../../../API/utils/handleError";
import convertCamelToSnakeCase from "../../../utilities/case-conversions/snakeCase";
import I18n from "../../../utilities/translations";
import {
  PersonalDetailsType,
  postPersonalDetails,
  fetchPersonalDetails,
} from "../../../API/onboarding/personal_details.api";
import { personalDetailsForm } from "./Shared/types/onboardingTypes";
import onDateChange from "../../../utilities/onDateChange";
import Loader from "../../inputs/_elements/loader";
import FormWrapper from "./Shared/FormWrapper";
import FormBody from "./Shared/FormBody";
import {
  OnboardingTourFormRef,
  useOnboardingTour,
} from "./Shared/context/OnboardingTourContext";

const ctx = { scope: "onboarding.v3.personal_details" };

const PersonalDetailsForm = forwardRef<
  OnboardingTourFormRef,
  { stateUpdate: (...args) => void; userId: number }
>(({ stateUpdate, userId }, ref) => {
  const [fetchedDefaultValues, setFetchedDefaultValues] =
    useState<personalDetailsForm>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
    reset,
    setValue,
  } = useForm<personalDetailsForm>({
    mode: "onTouched",
    defaultValues: fetchedDefaultValues,
  });

  const { setCanSubmitForm, setSecondaryBtnName, setIsSubmitting } =
    useOnboardingTour();

  useEffect(() => {
    setSecondaryBtnName(null);
  }, [setSecondaryBtnName]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchPersonalDetails(userId);
        if (res.status === "ok") {
          const details = res.data.personal_details;
          const data: personalDetailsForm = {
            firstName: details.first_name,
            middleName: details.middle_name,
            lastName: details.last_name,
            preferredName: details.preferred_name,
            dateOfBirth: details.date_of_birth || "",
            inputDateOfBirth: details.date_of_birth
              ? new Date(details.date_of_birth)
              : null,
          };
          setFetchedDefaultValues(data);
          reset(data);
          setIsLoading(false);
        } else {
          handleError(res);
        }
      } catch (err) {
        toastr.error("Something went wrong, please try again");
        throw err;
      }
    };

    fetchData();
  }, [reset, userId]);

  const onSubmit = async (body: personalDetailsForm) => {
    try {
      setIsSubmitting(true);
      const formattedRequest = convertCamelToSnakeCase(
        body,
      ) as PersonalDetailsType;

      const res = await postPersonalDetails(formattedRequest);
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

  useEffect(() => {
    setCanSubmitForm(isValid && !isLoading);
  }, [isValid, setCanSubmitForm, isLoading]);

  useImperativeHandle(ref, () => ({
    submitForm: () => handleSubmit(onSubmit)(), // Expose the submit function
  }));

  return (
    <>
      {isLoading ? (
        <div className="tw-my-4 tw-flex tw-justify-center">
          <Loader />
        </div>
      ) : (
        <FormWrapper>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="tw-flex tw-flex-1 tw-flex-col tw-overflow-hidden"
          >
            <FormBody>
              <Subheading>{I18n.t("paragraph_1", ctx)}</Subheading>
              <div className="tw-mb-6">
                <Controller
                  control={control}
                  name="firstName"
                  rules={{
                    required: I18n.t("first_name.errors.required", ctx),
                  }}
                  render={({ field: { onChange, onBlur, name, value } }) => (
                    <Input
                      label={I18n.t("first_name.label", ctx)}
                      setValue={onChange}
                      onBlur={onBlur}
                      name={name}
                      value={value || ""}
                      invalid={errors.firstName && errors.firstName.message}
                      requiredIconOnly={true}
                    />
                  )}
                />
              </div>

              <div className="tw-mb-6">
                <Controller
                  control={control}
                  name="middleName"
                  render={({ field: { onChange, name, value } }) => (
                    <Input
                      label={I18n.t("middle_name.label", ctx)}
                      setValue={onChange}
                      name={name}
                      value={value || ""}
                    />
                  )}
                />
              </div>

              <div className="tw-mb-6">
                <Controller
                  control={control}
                  name="lastName"
                  rules={{ required: I18n.t("last_name.errors.required", ctx) }}
                  render={({ field: { onChange, onBlur, name, value } }) => (
                    <Input
                      label={I18n.t("last_name.label", ctx)}
                      setValue={onChange}
                      onBlur={onBlur}
                      name={name}
                      value={value || ""}
                      invalid={errors.lastName && errors.lastName.message}
                      requiredIconOnly={true}
                    />
                  )}
                />
              </div>

              <div className="tw-mb-6">
                <Controller
                  control={control}
                  name="preferredName"
                  render={({ field: { onChange, onBlur, name, value } }) => (
                    <Input
                      label={I18n.t("preferred_name.label", ctx)}
                      setValue={onChange}
                      onBlur={onBlur}
                      name={name}
                      value={value || ""}
                    />
                  )}
                />
              </div>

              <div className="tw-mb-6">
                <Controller
                  control={control}
                  name="inputDateOfBirth"
                  rules={{
                    required: I18n.t("date_of_birth.errors.required", ctx),
                    validate: {
                      min_age: (value) =>
                        value < subYears(new Date(), 18) ||
                        I18n.t("date_of_birth.errors.min", ctx),
                      max_age: (value) =>
                        value > new Date("1920-01-01") ||
                        I18n.t("date_of_birth.errors.max", ctx),
                    },
                  }}
                  render={({ field: { onChange, onBlur, value, name } }) => (
                    <Datepicker
                      label={I18n.t("date_of_birth.label", ctx)}
                      // not using "uk_dob" preset here because it was interfering with the React Hook Form validation
                      preset="dob"
                      requiredLabel={true}
                      invalidText={
                        errors.inputDateOfBirth &&
                        errors.inputDateOfBirth.message
                      }
                      inputProps={{
                        name,
                        value,
                        onChange: (e) => {
                          onChange(e);
                          onDateChange(e, setValue, "dateOfBirth");
                          onBlur();
                        },
                      }}
                      legacyStyles={false}
                      locale={
                        window.Hnry?.User?.jurisdiction?.locale || "en-GB"
                      }
                    />
                  )}
                />
              </div>
            </FormBody>
          </form>
        </FormWrapper>
      )}
    </>
  );
});

PersonalDetailsForm.displayName = "PersonalDetailsForm";
export default PersonalDetailsForm;
