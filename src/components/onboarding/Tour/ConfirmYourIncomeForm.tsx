import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useForm, Controller } from "react-hook-form";
import Checkbox from "@hui/_atoms/checkbox/Checkbox";
import InputPrice from "@hui/_atoms/input/InputPrice";
import Alert from "@hui/_molecules/alert/Alert";
import Subheading from "@hui/_atoms/subheading/Subheading";
import Paragraph from "@hui/_atoms/paragraph/Paragraph";
import { isEqual } from "lodash";
import {
  confirmYourIncomeDTO,
  postConfirmedIncomeDetails,
} from "@api/onboarding/confirmYourIncome.api";
import convertCamelToSnakeCase from "../../../utilities/case-conversions/snakeCase";
import I18n from "../../../utilities/translations";
import { confirmYourIncomeForm } from "./Shared/types/onboardingTypes";
import { handleHashedError } from "../../../API/utils/handleError";
import { getUserJurisdictionCode } from "../../../utilities/user_attributes";
import { formatToLocalCurrency } from "../../../utilities/currency/currency_format";
import {
  useConfirmYourIncome,
  incomeEstimates,
} from "./Shared/hooks/useConfirmYourIncome";
import Loader from "../../inputs/_elements/loader";
import FormWrapper from "./Shared/FormWrapper";
import FormBody from "./Shared/FormBody";
import {
  OnboardingTourFormRef,
  useOnboardingTour,
} from "./Shared/context/OnboardingTourContext";
// scoping translations down to specific required area
const confirmIncomeContext = { scope: "onboarding.v3.confirm_your_income" };

const ConfirmYourIncomeForm = forwardRef<
  OnboardingTourFormRef,
  { stateUpdate: (...args) => void }
>(({ stateUpdate }, ref) => {
  const {
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    control,
  } = useForm<confirmYourIncomeForm>({ mode: "onTouched" });
  const { currencySymbol } = window.Hnry.User.jurisdiction;
  const minimumTaxableAmountThreshold = 12500;
  const {
    defaults,
    loadingDefaults,
    debouncedStartingTaxRate,
    loadingEstimatedStartingRate,
    loadingStudentLoanRate,
    loadingLeviesRate,
    estimatedStartingRate,
    studentLoanRate,
    debouncedStudentLoanRate,
    leviesRate,
    debouncedLeviesRate,
    hasStudentLoan,
  } = useConfirmYourIncome();
  const [displayTotalIncome, setDisplayTotalIncome] = useState<string>();
  const [numericalTotal, setNumericalTotal] = useState<number>();
  const [canSubmitIncomeForm, setCanSubmitIncomeForm] = useState(false);
  const myRef = useRef(null);
  const formRef = useRef(null);

  const { setCanSubmitForm, setIsSubmitting } = useOnboardingTour();
  useEffect(() => {
    setCanSubmitForm(canSubmitIncomeForm);
  }, [canSubmitIncomeForm, setCanSubmitForm]);

  useImperativeHandle(ref, () => ({
    submitForm: () => handleSubmit(onSubmit)(), // Expose the submit function
  }));

  useEffect(() => {
    if (defaults) {
      Object.keys(defaults).forEach((key) =>
        setValue(
          key as keyof confirmYourIncomeForm,
          defaults[key as keyof confirmYourIncomeForm],
        ),
      );
    }
  }, [defaults, setValue]);
  const formValues = watch();

  const setTotalIncome = ({
    selfEmployedIncome,
    salaryIncome,
    otherIncome,
  }: incomeEstimates) => {
    const total =
      Number(selfEmployedIncome) + Number(salaryIncome) + Number(otherIncome);
    const displayTotal = formatToLocalCurrency(
      total,
      getUserJurisdictionCode(),
      {
        decimals: true,
      },
    );
    setNumericalTotal(total);
    setDisplayTotalIncome(displayTotal);
  };

  useEffect(() => {
    const { otherIncome, salaryIncome, selfEmployedIncome } = formValues;
    // ensure we only check updates within inputPrice fields, not the consent checkbox
    const interimValuesToUpdate = {
      otherIncome,
      salaryIncome,
      selfEmployedIncome,
    };

    if (
      (otherIncome !== undefined ||
        selfEmployedIncome !== undefined ||
        salaryIncome !== undefined) &&
      !isEqual(formRef.current, interimValuesToUpdate)
    ) {
      debouncedStartingTaxRate(selfEmployedIncome, salaryIncome, otherIncome); // Calculate based on total
      debouncedStudentLoanRate({
        salaryIncome,
        otherIncome,
        selfEmployedIncome,
      }); // Calculate based on individual values
      debouncedLeviesRate({ salaryIncome, otherIncome, selfEmployedIncome }); // Calculate based on individual values
      setTotalIncome({ salaryIncome, otherIncome, selfEmployedIncome });
      formRef.current = interimValuesToUpdate;
    }
  }, [
    formValues,
    debouncedStartingTaxRate,
    debouncedStudentLoanRate,
    debouncedLeviesRate,
  ]);

  useEffect(() => {
    setCanSubmitIncomeForm(
      isValid &&
        !loadingEstimatedStartingRate &&
        !loadingStudentLoanRate &&
        !loadingLeviesRate,
    );
  }, [
    isValid,
    loadingEstimatedStartingRate,
    loadingStudentLoanRate,
    loadingLeviesRate,
  ]);

  const onSubmit = async (body: confirmYourIncomeForm) => {
    try {
      setIsSubmitting(true);
      const calculatedTaxRates = {
        taxRate: estimatedStartingRate,
        studentLoanRate: hasStudentLoan ? studentLoanRate : "0.00%",
        insuranceRate: leviesRate,
      };

      const formattedRequest = convertCamelToSnakeCase({
        ...body,
        calculatedTaxRates: { ...calculatedTaxRates },
      }) as confirmYourIncomeDTO;

      const res = await postConfirmedIncomeDetails(formattedRequest);
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

  return (
    <>
      {loadingDefaults ? (
        <div className="relative tw-m-auto tw-block tw-h-[90%] tw-min-w-fit tw-overflow-auto tw-rounded-md">
          <div className="tw-flex tw-h-full tw-flex-col tw-items-center tw-justify-center">
            <div data-testid="loading-state">
              <Loader />
            </div>
          </div>
        </div>
      ) : (
        <FormWrapper>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="tw-flex tw-flex-1 tw-flex-col tw-overflow-hidden"
          >
            <FormBody>
              <div className="tw-grid tw-h-auto tw-grid-flow-row tw-grid-rows-1">
                <div className="tw-row-span-9">
                  <Subheading>
                    {I18n.t("sub_title", confirmIncomeContext)}
                  </Subheading>
                  <Paragraph>
                    {I18n.t("paragraph_1", confirmIncomeContext)}
                  </Paragraph>
                  {defaults?.selfEmployedIncome ? (
                    <div className="tw-mb-6">
                      <Controller
                        control={control}
                        name="selfEmployedIncome"
                        rules={{
                          required: I18n.t(
                            "warnings.required",
                            confirmIncomeContext,
                          ),
                          min: {
                            value: 0.01,
                            message: I18n.t(
                              "warnings.min",
                              confirmIncomeContext,
                            ),
                          },
                        }}
                        render={({
                          field: { onChange, name, value, onBlur },
                        }) => (
                          <InputPrice
                            onChange={onChange}
                            onBlur={onBlur}
                            currencySign={currencySymbol}
                            label={I18n.t(
                              "label.self_employed",
                              confirmIncomeContext,
                            )}
                            invalid={errors?.selfEmployedIncome?.message}
                            value={value?.toString() || ""}
                            placeholder="50,000"
                            name={name}
                            paragraphError={false}
                            requiredIconOnly={true}
                          />
                        )}
                      />
                    </div>
                  ) : null}

                  {defaults?.salaryIncome ? (
                    <div className="tw-mb-6">
                      <Controller
                        control={control}
                        name="salaryIncome"
                        render={({
                          field: { onChange, name, value, onBlur },
                        }) => (
                          <InputPrice
                            onChange={onChange}
                            onBlur={onBlur}
                            currencySign={currencySymbol}
                            label={I18n.t("label.salary", confirmIncomeContext)}
                            value={value?.toString() || ""}
                            placeholder="50,000"
                            name={name}
                          />
                        )}
                      />
                    </div>
                  ) : null}

                  {defaults?.otherIncome ? (
                    <div className="tw-mb-6">
                      <Controller
                        control={control}
                        name="otherIncome"
                        render={({
                          field: { onChange, name, value, onBlur },
                        }) => (
                          <InputPrice
                            onChange={onChange}
                            onBlur={onBlur}
                            currencySign={currencySymbol}
                            label={I18n.t("label.other", confirmIncomeContext)}
                            value={value?.toString() || ""}
                            placeholder="50,000"
                            name={name}
                          />
                        )}
                      />
                    </div>
                  ) : null}

                  <div>
                    <div className="tw-rounded-lg tw-bg-brand tw-text-white">
                      <table className="table tax-rate-preview">
                        <tbody>
                          <tr>
                            <td>
                              {" "}
                              {I18n.t(
                                "display.income",
                                confirmIncomeContext,
                              )}{" "}
                            </td>
                            <td className="tw-text-right">
                              {displayTotalIncome}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="tw-rounded-lg tw-bg-brand tw-text-white">
                    <table className="table tax-rate-preview">
                      <tbody>
                        <tr>
                          <td className="!tw-border-0">
                            <span>
                              {I18n.t("display.tax", confirmIncomeContext)}
                            </span>
                          </td>
                          <td className="!tw-border-0 tw-text-right">
                            {loadingEstimatedStartingRate ? (
                              <div
                                className="lds-ellipsis tw-text-white"
                                aria-hidden="true"
                              >
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                              </div>
                            ) : (
                              estimatedStartingRate
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="!tw-border-0 !tw-pt-0">
                            <span>
                              {I18n.t(
                                "display.national_insurance",
                                confirmIncomeContext,
                              )}
                            </span>
                          </td>
                          <td className="!tw-border-0 !tw-pt-0 tw-text-right">
                            {loadingLeviesRate ? (
                              <div
                                className="lds-ellipsis tw-text-white"
                                aria-hidden="true"
                              >
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                              </div>
                            ) : (
                              leviesRate
                            )}
                          </td>
                        </tr>
                        {hasStudentLoan ? (
                          <tr>
                            <td className="!tw-border-0 !tw-pt-0">
                              <span>
                                {I18n.t(
                                  "display.student_loan",
                                  confirmIncomeContext,
                                )}
                              </span>
                            </td>
                            <td className="!tw-border-0 !tw-pt-0 tw-text-right">
                              {loadingStudentLoanRate ? (
                                <div
                                  className="lds-ellipsis tw-text-white"
                                  aria-hidden="true"
                                >
                                  <div></div>
                                  <div></div>
                                  <div></div>
                                  <div></div>
                                </div>
                              ) : (
                                studentLoanRate
                              )}
                            </td>
                          </tr>
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                  {numericalTotal < minimumTaxableAmountThreshold ? (
                    <Alert>
                      {" "}
                      {I18n.t(
                        "warnings.below_tax_threshold",
                        confirmIncomeContext,
                      )}{" "}
                    </Alert>
                  ) : null}
                  <div className="tw-mb-4">
                    <Controller
                      control={control}
                      name="acceptStartingRate"
                      rules={{
                        required: "You must accept the starting tax rate",
                      }}
                      render={({ field: { name, onChange, onBlur } }) => (
                        <label
                          htmlFor={"accept-starting-tax-rate"}
                          className="tw-flex tw-gap-4"
                        >
                          <Checkbox
                            testId="accept-starting-tax-rate-checkbox"
                            name={name}
                            id={"accept-starting-tax-rate"}
                            onCheckedChange={onChange}
                            onBlur={onBlur}
                            myRef={myRef}
                          />
                          <span className="tw-text-sm">
                            {I18n.t("checkbox", confirmIncomeContext)}
                          </span>
                        </label>
                      )}
                    />
                    {errors.acceptStartingRate && (
                      <span className="tw-text-sm tw-text-red-600">
                        {" "}
                        {errors.acceptStartingRate.message}{" "}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </FormBody>
          </form>
        </FormWrapper>
      )}
    </>
  );
});

ConfirmYourIncomeForm.displayName = "ConfirmYourIncomeForm";
export default ConfirmYourIncomeForm;
