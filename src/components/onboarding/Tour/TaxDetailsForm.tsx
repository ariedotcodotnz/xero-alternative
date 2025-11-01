import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useForm, Controller } from "react-hook-form";
import Input from "@hui/_atoms/input/Input";
import Alert from "@hui/_molecules/alert/Alert";
import Icon from "@hui/_atoms/icons/icon/Icon";
import Checkbox from "@hui/_atoms/checkbox/Checkbox";
import Subheading from "@hui/_atoms/subheading/Subheading";
import classNames from "classnames";
import {
  getTaxDetails,
  postTaxDetails,
  taxDetailsDto,
} from "../../../API/onboarding/taxDetails.api";
import convertCamelToSnakeCase from "../../../utilities/case-conversions/snakeCase";
import convertSnakeToCamelCase from "../../../utilities/case-conversions/camelCase";
import I18n from "../../../utilities/translations";
import { ukTaxDetailsForm } from "./Shared/types/onboardingTypes";
import { handleHashedError } from "../../../API/utils/handleError";
import Loader from "../../inputs/_elements/loader";
import FormWrapper from "./Shared/FormWrapper";
import FormBody from "./Shared/FormBody";
import {
  OnboardingTourFormRef,
  useOnboardingTour,
} from "./Shared/context/OnboardingTourContext";

// scoping translations down to specific required area
const taxDetailsContext = { scope: "onboarding.v3.tax_details" };

const FormInputInfo = ({ input }: { input: string }) => (
  <div className="tw-mt-2 tw-block tw-text-sm"> {input} </div>
);

const convertValueToUpperCase = (value: string) => value?.toUpperCase();

interface iTaxDetailsForm {
  stateUpdate: (...args) => void;
}

const TaxDetailsForm = forwardRef<OnboardingTourFormRef, iTaxDetailsForm>(
  ({ stateUpdate }, ref) => {
    const {
      handleSubmit,
      formState: { errors, isValid },
      getFieldState,
      control,
      watch,
      reset,
      setValue,
      trigger,
    } = useForm<ukTaxDetailsForm>({ mode: "onTouched" });
    const [isLoading, setIsLoading] = useState(true);
    const [showIsGSTRegistered, setShowIsGSTRegistered] = useState(false);
    const [isVatRequired, setIsVatRequired] = useState(true);
    const [savedVatNumber, setSavedVatNumber] = useState(null);

    const niNumberPH = watch("taxIdNumber");
    const taxIDFieldState = getFieldState("taxIdNumber");
    const vatNumberInput = watch("vatNumber");

    const vatNotRequiredRef = useRef(null);

    const { setPrimaryBtnTestId, setCanSubmitForm, setIsSubmitting } =
      useOnboardingTour();

    useEffect(() => {
      setPrimaryBtnTestId("tax-details-submit-btn");
    }, [setPrimaryBtnTestId]);

    useEffect(() => {
      setCanSubmitForm(isValid && !isLoading);
    }, [isLoading, isValid, setCanSubmitForm]);

    useEffect(() => {
      setValue("taxIdNumber", convertValueToUpperCase(niNumberPH));
      if (niNumberPH && taxIDFieldState.isTouched) {
        trigger("taxIdNumber");
      }
    }, [niNumberPH, setValue, taxIDFieldState.isTouched, trigger]);

    useEffect(() => {
      if (!isVatRequired) {
        setSavedVatNumber(vatNumberInput);
        setValue("vatNumber", null);
      } else {
        setValue("vatNumber", savedVatNumber);
      }
      trigger("vatNumber");
    }, [isVatRequired, trigger]);

    const getGSTRegistration = async () => {
      try {
        const { data } = await getTaxDetails();
        setShowIsGSTRegistered(data.is_gst_registered);
        setIsVatRequired(data.is_gst_registered);
        reset(convertSnakeToCamelCase(data));
        setIsLoading(false);
      } catch (e) {
        toastr.error("Something went wrong, please try again");
      }
    };

    useEffect(() => {
      getGSTRegistration();
    }, []);

    useEffect(() => {
      setValue("taxIdNumber", convertValueToUpperCase(niNumberPH));
    }, [niNumberPH, setValue]);

    const onSubmit = async (body: ukTaxDetailsForm) => {
      try {
        setIsSubmitting(true);
        const formattedRequest = convertCamelToSnakeCase(body) as taxDetailsDto;
        const res = await postTaxDetails(formattedRequest);
        if (res.status === "ok") {
          stateUpdate(res.data.state);
        } else {
          handleHashedError(res);
        }
      } catch (err) {
        toastr.error("Something went wrong, please try again");
      } finally {
        setIsSubmitting(false);
      }
    };

    useImperativeHandle(ref, () => ({
      submitForm: () => handleSubmit(onSubmit)(), // Expose the submit function
    }));

    const updateVatStatus = (change) => {
      setValue("vatNotRequired", change);
      setIsVatRequired(!change);
    };

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
                <div className="tw-row-span-9 md:tw-row-span-full">
                  {showIsGSTRegistered && (
                    <div className="tw-mb-6">
                      <Subheading>
                        <span
                          className={classNames({
                            "after:tw-ml-1 after:tw-inline after:tw-text-red after:tw-content-['*']":
                              isVatRequired,
                          })}
                        >
                          {I18n.t("vat_number.title", taxDetailsContext)}
                        </span>
                      </Subheading>
                      <div>
                        {/* Vat should only appear if Vat is selected on previous screens, need to grab isGSTRegistered somehow */}
                        <Controller
                          control={control}
                          name="vatNumber"
                          rules={{
                            required: {
                              value: isVatRequired,
                              message: I18n.t(
                                "vat_number.required",
                                taxDetailsContext,
                              ),
                            },
                            validate: (value) =>
                              isVatRequired
                                ? !value ||
                                  /^(GB)?\d{9}$/.test(value) ||
                                  I18n.t("vat_number.error", taxDetailsContext)
                                : true,
                          }}
                          render={({
                            field: { onChange, name, value, onBlur },
                          }) => (
                            <Input
                              testId="vatNumberInput"
                              label={I18n.t(
                                "vat_number.label",
                                taxDetailsContext,
                              )}
                              setValue={onChange}
                              name={name}
                              value={value || ""}
                              invalid={
                                errors.vatNumber && errors.vatNumber.message
                              }
                              stylisedError={false}
                              onBlur={onBlur}
                              disabled={!isVatRequired}
                            />
                          )}
                        />

                        {!errors.vatNumber && (
                          <FormInputInfo
                            input={I18n.t(
                              "vat_number.about",
                              taxDetailsContext,
                            )}
                          />
                        )}
                        <div className="pt-1">
                          <Controller
                            control={control}
                            name="vatNotRequired"
                            rules={{}}
                            render={({ field: { name } }) => (
                              <label
                                htmlFor={"tax-details-not-vat"}
                                className="tw-mb-1 tw-flex tw-gap-4"
                              >
                                <Checkbox
                                  testId="vatNotRequiredCheckbox"
                                  name={name}
                                  id={"tax-details-not-vat"}
                                  onCheckedChange={(change) =>
                                    updateVatStatus(change)
                                  }
                                  myRef={vatNotRequiredRef}
                                />
                                <span className="tw-text-sm">
                                  {"I am not registered for VAT"}
                                </span>
                              </label>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="tw-mb-6">
                    <Subheading>
                      <span className="after:tw-ml-1 after:tw-inline after:tw-text-red after:tw-content-['*']">
                        {I18n.t("tax_id_number.title", taxDetailsContext)}
                      </span>
                    </Subheading>
                    <div>
                      <Controller
                        control={control}
                        name="taxIdNumber"
                        rules={{
                          required: I18n.t(
                            "tax_id_number.required",
                            taxDetailsContext,
                          ),
                          validate: (value) =>
                            !value ||
                            /^[A-Z]{2}\d{6}[A-D]$/.test(value) ||
                            I18n.t("tax_id_number.error", taxDetailsContext),
                        }}
                        render={({
                          field: { onChange, name, value, onBlur },
                        }) => (
                          <Input
                            testId="taxIdNumberInput"
                            label=""
                            setValue={onChange}
                            name={name}
                            value={value || ""}
                            invalid={
                              errors.taxIdNumber && errors.taxIdNumber.message
                            }
                            stylisedError={false}
                            onBlur={onBlur}
                          />
                        )}
                      />
                      {!errors.taxIdNumber && (
                        <FormInputInfo
                          input={I18n.t(
                            "tax_id_number.about",
                            taxDetailsContext,
                          )}
                        />
                      )}
                    </div>
                  </div>

                  <div className="tw-mb-6">
                    <Subheading>
                      {I18n.t("utr_number.title", taxDetailsContext)}
                    </Subheading>
                    <div>
                      <Controller
                        control={control}
                        name="utrNumber"
                        rules={{
                          validate: (value) =>
                            !value ||
                            /^(K?\d{10}K?|K?\d{13}K?)$/.test(value) ||
                            I18n.t("utr_number.error", taxDetailsContext),
                        }}
                        render={({
                          field: { onChange, name, value, onBlur },
                        }) => (
                          <Input
                            testId="utrNumberInput"
                            label=""
                            setValue={onChange}
                            name={name}
                            value={value || ""}
                            stylisedError={false}
                            invalid={
                              errors.utrNumber && errors.utrNumber.message
                            }
                            onBlur={onBlur}
                          />
                        )}
                      />
                      {!errors.utrNumber && (
                        <FormInputInfo
                          input={I18n.t("utr_number.about", taxDetailsContext)}
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <Alert variant="info">
                      <div>
                        {" "}
                        {I18n.t("utr_number.info_text", taxDetailsContext)}
                      </div>
                      <div className="tw-pt-2">
                        <a
                          href={I18n.t(
                            "utr_number.learn_more_link",
                            taxDetailsContext,
                          )}
                        >
                          {" "}
                          Learn more{" "}
                          <span>
                            {" "}
                            <Icon
                              type="ArrowRightIcon"
                              classes="tw-inline-block !tw-text-blue-800"
                            />{" "}
                          </span>
                        </a>
                      </div>
                    </Alert>
                  </div>
                </div>
              </FormBody>
            </form>
          </FormWrapper>
        )}
      </>
    );
  },
);
TaxDetailsForm.displayName = "TaxDetailsForm";
export default TaxDetailsForm;
