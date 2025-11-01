import { postJson } from "./config/fetch.api";

export interface iBankAccountValidation {
  bank_branch_code?: string,
  account_number: string,
}

export interface iBankAccountValidationResult {
  success: boolean,
  bank_branch_code: {
    valid: boolean,
  },
  account_number: {
    valid: boolean,
  },
  status: string
}

export const checkBankValidation = async (body: iBankAccountValidation):Promise<iBankAccountValidationResult> => postJson(Routes.api_bank_account_number_validation_validate_bank_account_number_path(), JSON.stringify(body));