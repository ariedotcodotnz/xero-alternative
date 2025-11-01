import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { useForm, Controller } from "react-hook-form";
import AddressAutocompleteHui from "@hui/_organisms/address_autocomplete/AddressAutocompleteHui";
import PhoneNumberInput from "@hui/_atoms/input/PhoneNumberInput/phoneNumberInput";
import usePhoneNumberValidator from "@hui/_atoms/input/PhoneNumberInput/usePhoneValidator";
import Input from "@hui/_atoms/input/Input";
import Select from "@hui/_atoms/select/Select";
import Subheading from "@hui/_atoms/subheading/Subheading";
import {
  fetchPersonalContactDetails,
  PersonalContactDetailsType,
  postPersonalContactDetails,
} from "@api/onboarding/personal_contact_details.api";
import { Address } from "@hui/_organisms/address_autocomplete/types";
import handleError from "../../../API/utils/handleError";
import convertCamelToSnakeCase from "../../../utilities/case-conversions/snakeCase";
import I18n from "../../../utilities/translations";
import formNames from "./Shared/formNames";
import {
  acquisitionOption,
  acquisitionDetail,
  personalContactDetailsForm,
} from "./Shared/types/onboardingTypes";
import Loader from "../../inputs/_elements/loader";
import FormWrapper from "./Shared/FormWrapper";
import FormBody from "./Shared/FormBody";
import {
  OnboardingTourFormRef,
  useOnboardingTour,
} from "./Shared/context/OnboardingTourContext";

const ctx = { scope: "onboarding.v3.personal_contact_details" };

const addressValidator = (value: Address): boolean =>
  ((value.streetNumber !== "" && value.streetAddress !== "") ||
    value.addressLine1 !== "") &&
  value.postTown !== "" &&
  value.postcode !== "" &&
  value.country !== "";

const PersonalContactDetailsForm = forwardRef<
  OnboardingTourFormRef,
  { stateUpdate: (...args) => void; userId: number }
>(({ stateUpdate, userId }, ref) => {
  const [fetchedDefaultValues, setFetchedDefaultValues] =
    useState<personalContactDetailsForm>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {
    clearErrors,
    handleSubmit,
    formState: { errors, isValid },
    control,
    watch,
    reset,
    setValue,
  } = useForm<personalContactDetailsForm>({
    mode: "onTouched",
    defaultValues: fetchedDefaultValues,
  });
  const { isNumberValid } = usePhoneNumberValidator();
  const { setCanSubmitForm, setSecondaryBtnName, setIsSubmitting } =
    useOnboardingTour();

  useEffect(() => {
    setSecondaryBtnName(null);
  }, [setSecondaryBtnName]);

  const phoneNumber = watch("inputPhoneNumber");
  const acquisition = watch("acquisition");

  const acquisitionSelectOptions: { name: string; value: acquisitionOption }[] =
    [
      {
        name: I18n.t(
          "acquisition_select_option.accountant_or_financial_advisor",
          ctx,
        ),
        value: "accountant_or_financial_advisor",
      },
      {
        name: I18n.t("acquisition_select_option.billboard_adshel", ctx),
        value: "billboard_adshel",
      },
      {
        name: I18n.t("acquisition_select_option.event_or_meetup", ctx),
        value: "event_or_meetup",
      },
      {
        name: I18n.t("acquisition_select_option.friend_or_family", ctx),
        value: "friend_or_family",
      },
      {
        name: I18n.t("acquisition_select_option.google", ctx),
        value: "google",
      },
      {
        name: I18n.t("acquisition_select_option.hnry_team", ctx),
        value: "hnry_team",
      },
      {
        name: I18n.t("acquisition_select_option.news_article", ctx),
        value: "news_article",
      },
      {
        name: I18n.t("acquisition_select_option.other", ctx),
        value: "other",
      },
      {
        name: I18n.t("acquisition_select_option.radio", ctx),
        value: "radio",
      },
      {
        name: I18n.t("acquisition_select_option.recruiter_or_agent", ctx),
        value: "recruiter_or_agent",
      },
      {
        name: I18n.t("acquisition_select_option.referral_partner", ctx),
        value: "referral-partner",
      },
      {
        name: I18n.t("acquisition_select_option.social_media", ctx),
        value: "social_media",
      },
      {
        name: I18n.t("acquisition_select_option.tiktok", ctx),
        value: "tiktok",
      },
      {
        name: I18n.t("acquisition_select_option.tv", ctx),
        value: "tv",
      },
    ];

  const acquisitionExtraQuestion: {
    [T in acquisitionDetail]: { label: string };
  } = {
    other: {
      label: I18n.t("acquisition_detail_other.label", ctx),
    },
    "referral-partner": {
      label: I18n.t("acquisition_detail_referral.label", ctx),
    },
    recruiter_or_agent: {
      label: I18n.t("acquisition_detail_recruiter_or_agent.label", ctx),
    },
  };

  const acquisitionDetails: acquisitionDetail[] = useMemo(
    () => ["recruiter_or_agent", "referral-partner", "other"],
    [],
  );

  useEffect(() => {
    setValue("phoneNumber", `+${phoneNumber?.prefix} ${phoneNumber?.number}`);
  }, [phoneNumber, setValue]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchPersonalContactDetails(userId);
        if (res.status === "ok") {
          const details = res.data.personal_contact_details;
          const address = details.address_attributes;
          const data: personalContactDetailsForm = {
            phoneNumber: details.phone_number,
            inputPhoneNumber: {
              number: details.input_phone_number.number,
              prefix: details.input_phone_number.prefix,
            },
            acquisition: details.acquisition ?? "",
            acquisitionDetail: details.acquisition_detail ?? "",
            addressAttributes: address
              ? {
                  addressLine1: address?.address_line_1,
                  city: address?.city,
                  country: address?.country,
                  formattedAddress: address?.formatted_address,
                  googlePlaceId: address?.google_place_id,
                  postTown: address?.post_town,
                  postcode: address?.postcode,
                  state: address?.state,
                  streetNumber: address?.street_number,
                  streetAddress: address?.street_address,
                }
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

  const onSubmit = async (body: personalContactDetailsForm) => {
    try {
      setIsSubmitting(true);
      const formattedRequest = convertCamelToSnakeCase(
        body,
      ) as PersonalContactDetailsType;

      const res = await postPersonalContactDetails(formattedRequest);
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
                  name="inputPhoneNumber"
                  rules={{
                    validate: (value) =>
                      isNumberValid(`+${value?.prefix} ${value?.number}`) ||
                      I18n.t("phone_number.errors.invalid", ctx),
                  }}
                  render={({ field: { onChange, onBlur, name, value } }) => (
                    <PhoneNumberInput
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      name={name}
                      required={true}
                      invalid={
                        errors.inputPhoneNumber &&
                        errors.inputPhoneNumber.message
                      }
                      hideDropdown={true}
                    />
                  )}
                />
                {errors.inputPhoneNumber && (
                  <span className="tw-text-sm tw-text-red-600">
                    {" "}
                    {errors.inputPhoneNumber.message}{" "}
                  </span>
                )}
              </div>

              <div className="tw-mb-6">
                <Controller
                  control={control}
                  name="addressAttributes"
                  rules={{
                    validate: (value) =>
                      addressValidator(value) ||
                      I18n.t("address.errors.invalid", ctx),
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AddressAutocompleteHui
                      addressRequired={false}
                      jurisdictionCode="uk"
                      formValues={value}
                      formNames={formNames}
                      showMoreDetails={false}
                      displayLabel={I18n.t("address.label", ctx)}
                      onChange={(e) => {
                        onChange(e);
                        onBlur();
                      }}
                      data-testid="address"
                      requiredIconOnly={true}
                    />
                  )}
                />
                {errors.addressAttributes && (
                  <span className="tw-text-sm tw-text-red-600">
                    {" "}
                    {errors.addressAttributes.message}{" "}
                  </span>
                )}
              </div>

              <div className="tw-mb-6">
                <Controller
                  control={control}
                  name="acquisition"
                  rules={{ required: I18n.t("acquisition.error", ctx) }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Select
                      name="acquisition"
                      id="acquisition"
                      label={I18n.t("acquisition.label", ctx)}
                      onBlur={onBlur}
                      onChange={(e) => {
                        setValue("acquisitionDetail", "");
                        clearErrors("acquisitionDetail");
                        onChange(e);
                        onBlur();
                      }}
                      selectedValue={value}
                      required
                      options={acquisitionSelectOptions}
                      invalidText={
                        errors.acquisition && errors.acquisition.message
                      }
                    />
                  )}
                />
              </div>

              {acquisitionDetails.includes(
                acquisition as acquisitionDetail,
              ) && (
                <div className="tw-mb-6">
                  <Controller
                    control={control}
                    name="acquisitionDetail"
                    rules={{
                      required:
                        acquisition === "other"
                          ? I18n.t("acquisition_detail_other.error", ctx)
                          : false,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        name="acquisitionDetail"
                        id="acquisitionDetail"
                        label={acquisitionExtraQuestion[acquisition].label}
                        setValue={onChange}
                        onBlur={onBlur}
                        value={value}
                        required={acquisition === "other"}
                        invalid={
                          acquisition === "other" &&
                          errors.acquisitionDetail &&
                          errors.acquisitionDetail.message
                        }
                      />
                    )}
                  />
                </div>
              )}
            </FormBody>
          </form>
        </FormWrapper>
      )}
    </>
  );
});

PersonalContactDetailsForm.displayName = "PersonalContactDetailsForm";
export default PersonalContactDetailsForm;
