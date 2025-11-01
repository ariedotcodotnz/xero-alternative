import { OnboardingResponseBody } from "@hui/onboarding/Tour/Shared/types/onboardingTypes";
import { get, postJson } from "../config/fetch.api";
import { BasicResponse } from "../types/basicResponse";

export interface confirmYourIncomeDTO {
  selfEmployedIncome?: string;
  otherIncome?: string;
  salaryIncome?: string;
  acceptStartingRate: boolean;
  calculatedTaxRates: {
    taxRate: string;
    studentLoanRate: string;
    insuranceRate: string;
  };
}

export default interface getGivenIncomeEstimatesResponseBody
  extends BasicResponse {
  data: {
    salary: number;
    self_employed: number;
    other: number;
    has_student_loan: boolean;
  };
}

export const getGivenIncomeEstimates =
  async (): Promise<getGivenIncomeEstimatesResponseBody> =>
    get(Routes.api_onboarding_confirm_your_income_path());

export const postConfirmedIncomeDetails = async (
  body: confirmYourIncomeDTO,
): Promise<OnboardingResponseBody> =>
  postJson(
    Routes.api_onboarding_confirm_your_income_path(),
    JSON.stringify(body),
    false,
  );
