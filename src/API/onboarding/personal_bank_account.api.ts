import { patchJson } from "../config/fetch.api";
import { BasicResponse } from "../types/basicResponse";

export interface personalBankAccountDto {
  bankAccountType: "personal" | "business";
  bankAccountName: string;
  bankAccountNumberBankBranchCode: string;
  bankAccountNumberAccountNumber: string;
}

export default interface CopResponseBody extends BasicResponse {
  data: {
    cop: {
      fields: { label: string; value: string }[];
      record_attributes: unknown;
      submission_path?: string;
      user_id: number;
      payee_name: string;
      sort_code: string;
      account_number: string;
      account_type: string;
    };
  };
}

export const patchPersonalBankAccount = async (
  personalBankAccount: personalBankAccountDto,
): Promise<CopResponseBody> =>
  patchJson(
    Routes.cop_submission_api_onboarding_personal_bank_accounts_path(),
    JSON.stringify(personalBankAccount),
    false,
  );
