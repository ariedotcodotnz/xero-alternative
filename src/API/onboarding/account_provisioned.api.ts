import { OnboardingResponseBody } from "@hui/onboarding/Tour/Shared/types/onboardingTypes";
import { ApiResponseBody, get, postJson } from "../config/fetch.api";

export type UkBankAccountDetails = {
  account_name: string;
  account_number: string;
  bsb: string;
  full_name: string;
  jurisdiction: "uk";
};

export interface BankAccountSuccessResponse extends ApiResponseBody {
  status: string;
  data: {
    bank_account_details: UkBankAccountDetails;
  };
}

export const fetchBankAccountDetails = async (
  userId: number,
): Promise<BankAccountSuccessResponse> =>
  get(Routes.api_onboarding_account_provisioned_path(userId));

export const postAccountProvisioned =
  async (): Promise<OnboardingResponseBody> =>
    postJson(Routes.api_onboarding_account_provisioned_path(), "", false);

export default postAccountProvisioned;
