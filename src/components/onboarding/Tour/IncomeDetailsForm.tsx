import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useForm, Controller } from "react-hook-form";
import InputPrice from "@hui/_atoms/input/InputPrice";
import Datepicker from "@hui/inputs/datepicker/datepicker";
import Select from "@hui/_atoms/select/Select";
import Subheading from "@hui/_atoms/subheading/Subheading";
import {
  getIncomeBooleans,
  incomeDetailsDto,
  postIncomeDetails,
} from "../../../API/onboarding/income_details.api";
import convertSnakeToCamelCase from "../../../utilities/case-conversions/camelCase";
import handleError from "../../../API/utils/handleError";
import convertCamelToSnakeCase from "../../../utilities/case-conversions/snakeCase";
import {
  incomeDetailsForm,
  camelledIncomeBooleans,
} from "./Shared/types/onboardingTypes";
import I18n from "../../../utilities/translations";
import onDateChange from "../../../utilities/onDateChange";
import Loader from "../../inputs/_elements/loader";
import FormWrapper from "./Shared/FormWrapper";
import FormBody from "./Shared/FormBody";
import {
  OnboardingTourFormRef,
  useOnboardingTour,
} from "./Shared/context/OnboardingTourContext";

const ctx = { scope: "onboarding.v3.income_details" };

interface iIncomeDetailsForm {
  stateUpdate: (...args) => void;
}

const IncomeDetailsForm = forwardRef<OnboardingTourFormRef, iIncomeDetailsForm>(
  ({ stateUpdate }, ref) => {
    const [incomeBooleans, setIncomeBooleans] =
      useState<camelledIncomeBooleans>({
        hasSelfEmployedIncome: null,
        paye: null,
        hasOtherIncome: null,
      });
    const { hasSelfEmployedIncome, paye, hasOtherIncome } = incomeBooleans;
    const [isLoading, setIsLoading] = useState(true);
    const { currencySymbol } = window.Hnry.User.jurisdiction;
    const { setCanSubmitForm, setIsSubmitting } = useOnboardingTour();

    const {
      handleSubmit,
      formState: { errors, isValid },
      control,
      setValue,
    } = useForm<incomeDetailsForm>({
      mode: "onTouched",
      defaultValues: {
        priorExpensesThisYear: "",
        salaryIncome: null,
        salaryEndDateFromTour: null,
        otherIncome: null,
      },
    });

    const fetchIncomeBooleans = async () => {
      try {
        const incomeBooleansFromBackend = await getIncomeBooleans();
        setIncomeBooleans(
          convertSnakeToCamelCase(
            incomeBooleansFromBackend,
          ) as camelledIncomeBooleans,
        );
        setIsLoading(false);
      } catch (err) {
        toastr.error("Something went wrong, please try again");
        throw err;
      }
    };

    useEffect(() => {
      fetchIncomeBooleans();
    }, []);

    const onSubmit = async (body: incomeDetailsForm) => {
      try {
        setIsSubmitting(true);
        const formattedRequest = convertCamelToSnakeCase(
          body,
        ) as incomeDetailsDto;
        const res = await postIncomeDetails(formattedRequest);
        if (res.status === "ok") {
          stateUpdate(res.data.state);
        } else {
          handleError(res);
        }
      } catch (err) {
        toastr.error(
          "Something went wrong when submitting the form, please try again",
        );
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

    const priorExpensesThisYearOptions = [
      {
        value: "no_expenses",
        name: I18n.t("salary_income_options.no_expenses", ctx),
      },
      {
        value: "accountant",
        name: I18n.t("salary_income_options.accountant", ctx),
      },
      { value: "manual", name: I18n.t("salary_income_options.manual", ctx) },
    ];

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
                {hasSelfEmployedIncome ? (
                  <>
                    <Subheading>
                      {I18n.t("heading.self_employed_income", ctx)}
                    </Subheading>
                    <div className="tw-mb-6">
                      <Controller
                        control={control}
                        name="priorExpensesThisYear"
                        rules={{ required: "Please select an option" }}
                        render={({ field: { onChange, value, onBlur } }) => (
                          <Select
                            selectedValue={value}
                            id={"PETYSelect"}
                            options={priorExpensesThisYearOptions}
                            onBlur={onBlur}
                            onChange={onChange}
                            required={true}
                            label={I18n.t("label.self_employed_income", ctx)}
                            name={"priorExpensesThisYear"}
                          />
                        )}
                      />
                      {errors?.priorExpensesThisYear && (
                        <span className="tw-text-sm tw-text-red-600">
                          {errors.priorExpensesThisYear.message}
                        </span>
                      )}
                    </div>
                  </>
                ) : null}

                {paye ? (
                  <>
                    <Subheading>
                      {I18n.t("heading.salary_income", ctx)}
                    </Subheading>
                    <div className="align-items-center justify-content-center tw-mb-6">
                      <Controller
                        control={control}
                        name="salaryIncome"
                        rules={{
                          required: I18n.t(
                            "warnings.salary_income.required",
                            ctx,
                          ),
                          min: {
                            value: 0,
                            message: I18n.t("warnings.salary_income.min", ctx),
                          },
                          max: {
                            value: 9999999,
                            message: I18n.t("warnings.salary_income.max", ctx),
                          },
                        }}
                        render={({ field: { onChange, onBlur, name } }) => (
                          <InputPrice
                            onChange={onChange}
                            onBlur={onBlur}
                            currencySign={currencySymbol}
                            label={I18n.t("label.salary_income", ctx)}
                            invalid={errors?.salaryIncome?.message}
                            value={""}
                            placeholder="50,000"
                            name={name}
                            requiredIconOnly={true}
                          />
                        )}
                      />
                    </div>
                    <div className="align-items-center justify-content-center tw-mb-6">
                      <Controller
                        control={control}
                        name="salaryEndDateFromTour"
                        render={({ field: { onChange, value, name } }) => (
                          <Datepicker
                            label={I18n.t("label.salary_income_end_date", ctx)}
                            requiredLabel={false}
                            invalidText={
                              errors.salaryEndDateFromTour &&
                              errors.salaryEndDateFromTour.message
                            }
                            inputProps={{
                              name,
                              value,
                              onChange: (e) => {
                                onChange(e);
                                onDateChange(
                                  e,
                                  setValue,
                                  "salaryEndDateFromTour",
                                );
                              },
                            }}
                            legacyStyles={false}
                            locale={
                              window.Hnry?.User?.jurisdiction?.locale || "en-GB"
                            }
                            iosClearButton={/(ios)/i.test(
                              document.userPlatform,
                            )}
                          />
                        )}
                      />
                    </div>
                  </>
                ) : null}

                {hasOtherIncome ? (
                  <>
                    <Subheading>
                      {I18n.t("heading.other_income", ctx)}
                    </Subheading>
                    <div className="align-items-center justify-content-center">
                      <Controller
                        control={control}
                        name="otherIncome"
                        rules={{
                          required: I18n.t(
                            "warnings.other_income.required",
                            ctx,
                          ),
                          min: {
                            value: 0,
                            message: I18n.t("warnings.other_income.min", ctx),
                          },
                          max: {
                            value: 9999999,
                            message: I18n.t("warnings.other_income.max", ctx),
                          },
                        }}
                        render={({ field: { onChange, onBlur, name } }) => (
                          <InputPrice
                            onChange={onChange}
                            onBlur={onBlur}
                            currencySign={currencySymbol}
                            label={I18n.t("label.other_income", ctx)}
                            invalid={errors?.otherIncome?.message}
                            value={""}
                            placeholder="50,000"
                            name={name}
                            requiredIconOnly={true}
                          />
                        )}
                      />
                    </div>
                  </>
                ) : null}
              </FormBody>
            </form>
          </FormWrapper>
        )}
      </>
    );
  },
);
IncomeDetailsForm.displayName = "IncomeDetailsForm";
export default IncomeDetailsForm;
