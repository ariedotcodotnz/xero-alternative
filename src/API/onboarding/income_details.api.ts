import { OnboardingResponseBody } from "@hui/onboarding/Tour/Shared/types/onboardingTypes";
import { postJson, get } from "../config/fetch.api";
import BasicResponse from "../types/basicResponse.js";

export interface incomeDetailsDto {
  prior_expenses_this_year: number;
  salary_income: number;
  salary_end_date_from_tour: string;
  other_income: number;
}

export type snakedIncomeBooleans = {
  has_self_employed_income: boolean | null;
  paye: boolean | null;
  has_other_income: boolean | null;
};

export interface GetIncomeBooleansResponseBody extends BasicResponse {
  data: {
    income_booleans: snakedIncomeBooleans;
  };
}

export const postIncomeDetails = async (
  incomeDetails: incomeDetailsDto,
): Promise<OnboardingResponseBody> =>
  postJson(
    Routes.api_onboarding_income_details_path(),
    JSON.stringify(incomeDetails),
    false,
  );

export const getIncomeBooleans = async (): Promise<snakedIncomeBooleans> => {
  const response = (await get(
    Routes.api_onboarding_income_details_path(),
  )) as GetIncomeBooleansResponseBody;
  return response.data.income_booleans;
};
