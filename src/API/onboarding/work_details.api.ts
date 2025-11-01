import { OnboardingResponseBody } from "@hui/onboarding/Tour/Shared/types/onboardingTypes";
import { postJson } from "../config/fetch.api";

export interface workDetailsDto {
  incomeDetails: {
    selfEmployedIncome: boolean;
    salaryIncome: boolean;
    otherIncome: boolean;
    none: boolean;
  };
  taxDetails: {
    studentLoan: boolean;
    salesTaxRegistration: boolean;
    none: boolean;
  };
}

export const postWorkDetails = async (
  workDetails: workDetailsDto,
): Promise<OnboardingResponseBody> =>
  postJson(
    Routes.api_onboarding_work_details_path(),
    JSON.stringify(workDetails),
    false,
  );
