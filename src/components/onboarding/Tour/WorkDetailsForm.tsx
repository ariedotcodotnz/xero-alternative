import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { Controller, useForm } from "react-hook-form";
import Checkbox from "@hui/_atoms/checkbox/Checkbox";
import Subheading from "@hui/_atoms/subheading/Subheading";
import Paragraph from "@hui/_atoms/paragraph/Paragraph";
import convertCamelToSnakeCase from "../../../utilities/case-conversions/snakeCase";
import I18n from "../../../utilities/translations";
import { workDetailsForm } from "./Shared/types/onboardingTypes";
import {
  postWorkDetails,
  workDetailsDto,
} from "../../../API/onboarding/work_details.api";
import handleError from "../../../API/utils/handleError";
import FormWrapper from "./Shared/FormWrapper";
import FormBody from "./Shared/FormBody";
import {
  OnboardingTourFormRef,
  useOnboardingTour,
} from "./Shared/context/OnboardingTourContext";

const ctx = { scope: "onboarding.v3.work_details" };

interface iWorkDetailsForm {
  stateUpdate: (...args) => void;
  financialYearStart: string;
  financialYearEnd: string;
}

const WorkDetailsForm = forwardRef<OnboardingTourFormRef, iWorkDetailsForm>(
  ({ stateUpdate, financialYearStart, financialYearEnd }, ref) => {
    const {
      control,
      handleSubmit,
      setValue,
      getValues,
      formState: { errors, isValid },
    } = useForm<workDetailsForm>();
    const myRef = useRef(null);

    const { setCanSubmitForm, setIsSubmitting } = useOnboardingTour();

    useEffect(() => {
      setCanSubmitForm(isValid);
    }, [isValid, setCanSubmitForm]);

    useImperativeHandle(ref, () => ({
      submitForm: () => handleSubmit(onSubmit)(), // Expose the submit function
    }));

    const onSubmit = async (body: workDetailsForm) => {
      try {
        setIsSubmitting(true);
        const formattedRequest = convertCamelToSnakeCase(
          body,
        ) as workDetailsDto;
        const res = await postWorkDetails(formattedRequest);
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

    const isAnyKeyValueTrue = (value) => {
      if (value === undefined) return false;
      return !!Object.keys(value).find((key) => value[key]);
    };

    const incomeDetailsOptions = [
      {
        label: I18n.t("income_details.self_employed_income", ctx),
        value: "selfEmployedIncome",
      },
      {
        label: I18n.t("income_details.salary_income", ctx),
        value: "salaryIncome",
      },
      {
        label: I18n.t("income_details.other_income", ctx),
        value: "otherIncome",
      },
      {
        label: I18n.t("income_details.none", ctx),
        value: "none",
      },
    ];

    const taxDetailsOptions = [
      {
        label: I18n.t("tax_details.student_loan", ctx),
        value: "studentLoan",
      },
      {
        label: I18n.t("tax_details.sales_tax_registration", ctx),
        value: "salesTaxRegistration",
      },
      {
        label: I18n.t("tax_details.none", ctx),
        value: "none",
      },
    ];

    const onCheckedChange = (
      checked: boolean,
      optionValue: string,
      group: "incomeDetails" | "taxDetails",
    ) => {
      const valueCopy = { ...getValues(group) };

      if (optionValue === "none") {
        Object.keys(valueCopy).forEach((key) => {
          valueCopy[key] = false;
        });
      } else {
        valueCopy.none = false;
      }

      valueCopy[optionValue] = checked;
      setValue(group, valueCopy, { shouldValidate: true });
    };

    return (
      <>
        <FormWrapper>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="tw-flex tw-flex-1 tw-flex-col tw-overflow-hidden"
          >
            <FormBody>
              <Subheading>{I18n.t("paragraph_1", ctx)}</Subheading>
              <Paragraph>{I18n.t("paragraph_2", ctx)}</Paragraph>
              <Paragraph>
                <>
                  <span className="tw-font-bold">
                    {I18n.t("financial_year", ctx)}
                  </span>
                  {financialYearStart} - {financialYearEnd}
                </>
              </Paragraph>
              <div className="tw-mb-6">
                <p className="hnry-label">
                  {I18n.t("income_details.label", ctx)}
                </p>
                <Controller
                  control={control}
                  name="incomeDetails"
                  defaultValue={{
                    none: false,
                    otherIncome: false,
                    salaryIncome: false,
                    selfEmployedIncome: false,
                  }}
                  rules={{
                    validate: {
                      required: (value) =>
                        isAnyKeyValueTrue(value) || I18n.t("required", ctx),
                    },
                  }}
                  render={({ field: { value, name } }) => (
                    <>
                      {incomeDetailsOptions.map((option) => (
                        <label
                          htmlFor={`income-details-${option.value}`}
                          className="tw-mb-1 tw-flex tw-gap-4 tw-py-2"
                          key={option.value}
                        >
                          <Checkbox
                            name={option.label}
                            id={`income-details-${option.value}`}
                            checked={value[option.value]}
                            onCheckedChange={(checked) =>
                              onCheckedChange(checked, option.value, name)
                            }
                            myRef={myRef}
                          />
                          <span className="tw-text-sm">{option.label}</span>
                        </label>
                      ))}
                      {errors.incomeDetails && (
                        <p className="tw-mt-2 tw-block tw-text-sm tw-text-red-600">
                          {I18n.t("required", ctx)}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
              <div>
                <p className="hnry-label">{I18n.t("tax_details.label", ctx)}</p>
                <Controller
                  control={control}
                  name="taxDetails"
                  defaultValue={{
                    none: false,
                    studentLoan: false,
                    salesTaxRegistration: false,
                  }}
                  rules={{
                    validate: {
                      required: (value) =>
                        isAnyKeyValueTrue(value) || I18n.t("required", ctx),
                    },
                  }}
                  render={({ field: { value, name } }) => (
                    <>
                      {taxDetailsOptions.map((option) => (
                        <label
                          htmlFor={`tax-details-${option.value}`}
                          className="tw-mb-1 tw-flex tw-gap-4 tw-py-2"
                          key={option.value}
                        >
                          <Checkbox
                            name={option.label}
                            id={`tax-details-${option.value}`}
                            checked={value[option.value]}
                            onCheckedChange={(checked) =>
                              onCheckedChange(checked, option.value, name)
                            }
                            myRef={myRef}
                          />
                          <span className="tw-text-sm">{option.label}</span>
                        </label>
                      ))}
                      {errors.taxDetails && (
                        <p className="tw-mt-2 tw-block tw-text-sm tw-text-red-600">
                          {I18n.t("required", ctx)}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
            </FormBody>
          </form>
        </FormWrapper>
      </>
    );
  },
);

WorkDetailsForm.displayName = "WorkDetailsForm";
export default WorkDetailsForm;
