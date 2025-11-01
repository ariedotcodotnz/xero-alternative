import React, { forwardRef, useState, useEffect, useImperativeHandle, useCallback, useRef } from "react";
import { PersonalDetailsType } from "@api/onboarding/personal_details.api";
import VerifyIdentityExternalVerificationResponseBody,
{ postVerifyIdentityExternalVerification, putVerifyIdentityExternalVerification } from "@api/onboarding/verify_identity_external_verification.api";
import { handleHashedError } from "@api/utils/handleError";
import Input from "@hui/_atoms/input/Input";
import Datepicker from "@hui/inputs/datepicker/datepicker";
import { format, subYears } from "date-fns";
import { useForm, Controller } from "react-hook-form";
import convertCamelToSnakeCase from "../../../../utilities/case-conversions/snakeCase";
import ExternalVerificationAlert from "../ExternalVerificationAlert";
import { OnboardingTourFormRef, useOnboardingTour } from "../Shared/context/OnboardingTourContext";
import FormBody from "../Shared/FormBody";
import FormWrapper from "../Shared/FormWrapper";
import { anzPassportFailureResubmissionForm, iVerifyIdentityExternalVerificationForm, verifyIdentityExternalVerificationForm } from "../Shared/types/onboardingTypes";
import I18n from "../../../../utilities/translations"
import SignUpTourLoader from "../Shared/SignUpTourLoader";

const ctx = { scope: "onboarding.v3.verify_identity_external_verification" };


// eslint-disable-next-line import/prefer-default-export
export const ANZExternalVerificationForm = forwardRef<OnboardingTourFormRef, iVerifyIdentityExternalVerificationForm>(
  ({ stateUpdate, intercomLink, runVerificationOnLoad, userVerification, setUserVerification, personalDetails }, ref) => {
    const verificationInitiatedRef = useRef(false);

    const personalDetailsValues: anzPassportFailureResubmissionForm = {
      firstName: personalDetails?.first_name,
      middleName: personalDetails?.middle_name,
      lastName: personalDetails?.last_name,
      dateOfBirth: personalDetails?.date_of_birth,
      inputDateOfBirth: personalDetails?.date_of_birth ? new Date(personalDetails.date_of_birth) : null,
      inputExpiresOn: userVerification?.verifiable?.expires_on ? new Date(userVerification.verifiable.expires_on) : null,
      expiresOn: userVerification?.verifiable?.expires_on,
      passportNumber: userVerification?.verifiable?.passport_number
    }

    const { handleSubmit, formState: { errors, isValid }, control, setValue } = useForm<anzPassportFailureResubmissionForm>({
      mode: "onTouched",
      defaultValues: personalDetailsValues,
    })

    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [failedVerification, setFailedVerification] = useState(false);
    const [maxFailedAttemptsReached, setMaxFailedAttemptsReached] = useState(false);
    const { setCanSubmitForm, setPrimaryBtnName } = useOnboardingTour()

    useEffect(() => {
      setCanSubmitForm(!maxFailedAttemptsReached && isValid && !isLoading)
    }, [isLoading, isValid, maxFailedAttemptsReached, setCanSubmitForm])

    useEffect(() => {
      if (isLoading || !personalDetails) {
        setPrimaryBtnName(null)
      } else {
        setPrimaryBtnName("Next")
      }

    }, [isLoading, setPrimaryBtnName, personalDetails])

    useImperativeHandle(ref, () => ({
      submitForm: () => handleSubmit(onSubmit)() // Expose the submit function
    }));

    useEffect(() => {
      setMaxFailedAttemptsReached(userVerification?.max_failed_attempts_reached)
      setFailedVerification(!userVerification?.verified)
    }, [userVerification]);



    const handleResponse = useCallback((res: VerifyIdentityExternalVerificationResponseBody) => {
      if (res.status === "ok") {
        setFailedVerification(!res.data?.user_verification?.verified)
        setMaxFailedAttemptsReached(res.data?.user_verification?.max_failed_attempts_reached)
        setShowForm(!res.data?.user_verification?.verified)
        if (res.data?.state === "blocked_identity") {
          window.location = Routes.home_index_path();
        }

        if (res.data?.user_verification) {
          setUserVerification(res.data.user_verification)
        }
        if (res.data?.state) {
          stateUpdate(res.data.state)
        }
        setIsLoading(false);

      } else {
        handleHashedError(res)
        setShowForm(true);
        setIsLoading(false);
      }
    }, [setUserVerification, stateUpdate])

    const doExternalVerificationCallback = useCallback(() => {
      const doExternalVerification = async () => {
        try {
          const res = await postVerifyIdentityExternalVerification()
          handleResponse(res)
        } catch (err) {
          toastr.error("Something went wrong, please try again");
          throw err
        }
      }
      if (runVerificationOnLoad) {
        doExternalVerification();
      }
    }, [runVerificationOnLoad, handleResponse])

    useEffect(() => {
      if (runVerificationOnLoad) {
        if (!verificationInitiatedRef.current) {
          verificationInitiatedRef.current = true; // Mark as initiated
          setShowForm(false);
          setIsLoading(true);
          doExternalVerificationCallback();
        }
      }
      else {
        verificationInitiatedRef.current = false;

        setShowForm(true);
        setIsLoading(false);
        doExternalVerificationCallback();
      }

    }, [doExternalVerificationCallback, runVerificationOnLoad]);


    const onDateChange = (value: Date, valueName: "dateOfBirth" | "expiresOn") => {
      // convert date to iso8601 for use on b/
      if (value) {
        setValue(valueName, format(value, "yyyy-MM-dd"))
      }
    }

    const onSubmit = async (body: verifyIdentityExternalVerificationForm) => {
      try {
        setShowForm(false);
        setIsLoading(true);
        const formattedRequest = convertCamelToSnakeCase(body) as PersonalDetailsType
        const res = await putVerifyIdentityExternalVerification(formattedRequest)
        handleResponse(res)
      } catch (err) {
        toastr.error("Something went wrong, please try again");
        throw err
      } finally {
        setShowForm(true);
        setIsLoading(false);
      }
    }

    if (!personalDetails) {
      return (<SignUpTourLoader text={I18n.t("loading", ctx)} />)
    }

    return (<>
      <FormWrapper>
        {isLoading &&
          <SignUpTourLoader text={I18n.t("loading", ctx)} />
        }

        {!isLoading &&
          <form onSubmit={handleSubmit(onSubmit)} className="tw-flex tw-flex-col tw-flex-1 tw-overflow-hidden" data-testid="anz-external-verification-form">
            <FormBody>

              <ExternalVerificationAlert
                failedVerification={failedVerification}
                maxFailedAttemptsReached={maxFailedAttemptsReached}
                intercomLink={intercomLink}
                userVerification={userVerification}
                isUkForm={false}
              />

              {showForm &&
                <>
                  <div className="tw-mb-6">
                    <Controller
                      control={control}
                      name="firstName"
                      rules={{ required: I18n.t("first_name.errors.required", ctx) }}
                      render={({ field: { onChange, onBlur, name, value } }) => (
                        <Input
                          label={I18n.t("first_name.label", ctx)}
                          setValue={onChange}
                          onBlur={onBlur}
                          name={name}
                          value={value || ""}
                          invalid={errors.firstName && errors.firstName.message}
                          requiredIconOnly={true} />
                      )}
                    />
                  </div>

                  <div className="tw-mb-6">
                    <Controller
                      control={control}
                      name="middleName"
                      render={({ field: { onChange, onBlur, name, value } }) => (
                        <Input label={I18n.t("middle_name.label", ctx)} setValue={onChange} onBlur={onBlur} name={name} value={value || ""} />
                      )}
                    />
                  </div>

                  <div className="tw-mb-6">
                    <Controller
                      control={control}
                      name="lastName"
                      rules={{ required: I18n.t("last_name.errors.required", ctx) }}
                      render={({ field: { onChange, onBlur, name, value } }) => (
                        <Input label={I18n.t("last_name.label", ctx)} setValue={onChange} onBlur={onBlur} name={name} value={value || ""}
                          invalid={errors.lastName && errors.lastName.message}
                          requiredIconOnly={true} />
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
                          min_age: (value) => value < subYears(new Date(), 18) || I18n.t("date_of_birth.errors.min", ctx),
                          max_age: (value) => value > new Date("1920-01-01") || I18n.t("date_of_birth.errors.max", ctx)
                        }
                      }}


                      render={({ field: { onChange, onBlur, value, name } }) => (
                        <Datepicker
                          label={I18n.t("date_of_birth.label", ctx)}
                          // not using "uk_dob" preset here because it was interfering with the React Hook Form validation
                          preset="dob"
                          requiredLabel={true}
                          invalidText={errors.inputDateOfBirth && errors.inputDateOfBirth.message}
                          inputProps={{
                            name, value, onChange: (e) => {
                              onChange(e);
                              onDateChange(e, "dateOfBirth");
                              onBlur()
                            }
                          }}
                          legacyStyles={false}
                          locale={window.Hnry?.User?.jurisdiction?.locale || "en-GB"}
                        />
                      )}
                    />
                  </div>

                  <div className="tw-mb-6">
                    <Controller
                      control={control}
                      name="passportNumber"
                      rules={{
                        required: I18n.t("passport_number.required", ctx),
                        maxLength: {
                          value: 9,
                          message: I18n.t("passport_number.required", ctx)
                        },
                      }}
                      render={({ field: { onChange, onBlur, value, name } }) => (
                        <Input
                          label={I18n.t("passport_number.label", ctx)}
                          setValue={onChange}
                          onBlur={onBlur}
                          name={name} value={value || ""}
                          invalid={errors.passportNumber && errors.passportNumber.message}
                          requiredIconOnly={true} stylisedError={false} testId="passportNumber" />
                      )} />
                  </div>

                  <div className="align-items-center justify-content-center tw-mb-6">
                    <Controller
                      control={control}
                      name="inputExpiresOn"
                      rules={{
                        required: I18n.t("expires_on.required", ctx),
                        validate: {
                          expired: (value) =>
                            value > new Date() || I18n.t("expires_on.expired", ctx)
                        },
                      }}
                      render={({ field: { onChange, onBlur, value, name } }) => (
                        <Datepicker
                          label={I18n.t("expires_on.label", ctx)}
                          preset="timeless"
                          requiredLabel={true}
                          invalidText={
                            errors.inputExpiresOn && errors.inputExpiresOn.message
                          }
                          inputProps={{
                            name, value, onChange: (e) => {
                              onChange(e);
                              onDateChange(e, "expiresOn");
                              onBlur()
                            }
                          }}
                          legacyStyles={false}
                          locale={
                            window.Hnry?.User?.jurisdiction?.locale || "en-GB"
                          }
                          expandUpwards={true}
                        />
                      )} />
                  </div>
                </>
              }
            </FormBody>
          </form >
        }
      </FormWrapper>
    </>
    )
  })


ANZExternalVerificationForm.displayName = "ANzExternalVerificationForm"
export default ANZExternalVerificationForm