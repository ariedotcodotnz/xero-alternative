import { postJson, putJson } from "./config/fetch.api"

export interface iAllocationPreference {
  payee_name: string;
  payee_account_type: "personal" | "business";
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  [key: string]: any
}
export interface iFinancial  {
  bank_account_name: string;
  bank_account_type: "personal" | "business"
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  [key: string]: any
}
export type RecordName = "allocation_preference" | "financial_attributes"

export type RecordDataType = iFinancial | iAllocationPreference

export type InferDataType<T> = T extends "allocation_preference" 
? iFinancial 
: T extends "financial_attributes" ? iAllocationPreference : never;


export interface iScaChallengeSubmit {
  context: string;
  data: {
    [recordName: string]: unknown;
    payee: { confirmation_required: boolean };
    confirm_payee: { 
      create_request_external_ref: string,
      payee_suggestion?: {
        payee_name: string,
        account_type: string
      },
      accept_suggestion?: boolean,
      payee_details: {
        payee_name: string,
        sort_code: string,
        account_number: string,
        name_verification_details: {
          account_type: string
        }
      },
      secondary_identification?: string
    };
    challenge: {
      callback_url: string;
    };
  }
}

export interface iCreatePayee {
  user_id: number,
  payee_name: string,
  sort_code: string,
  account_number: string,
  account_type: string,
  secondary_identification?: string
}

export type CopAccountTypes = "personal" | "business"

export interface iPayeeSuggestion {
  payee_name: string,
  account_type: CopAccountTypes | string
}

export interface iCreatePayeeResponseBodyType {
  status: string,
  message?: {
      metadata: {
      message: 'SUCCESS' | string,
      otp_required: boolean,
      result_code: string,
      payee_reference?: string
    },
    name_verification_result: {
      reason_code?: string,
      matched: boolean,
      name?: string,
    },
  },
  payee_suggestion?: iPayeeSuggestion,
  payee_external_ref: string
}

export interface iCreatePayeeResponseBody {
  message: object;
}

export interface iScaChallenge {
  data: {
    challenge: {
      callback_url: string;
    }
    mobile_based_verification: {
      external_challenge_identifier: string;
    }
    device_registration: {
      name: string;
    }
  }
}

export const postScaChallenge = async (submissionPath: string, body: iScaChallengeSubmit):Promise<iScaChallenge> =>
  postJson(submissionPath, JSON.stringify(body), true)

export const putScaChallenge = async (submissionPath: string, body: iScaChallengeSubmit):Promise<iScaChallenge> =>
  putJson(submissionPath, JSON.stringify(body), true)

export const createPayee = async (body: iCreatePayee) =>
  postJson(Routes.payees_create_path(), JSON.stringify(body), true)

export const typedSCASuggestion = (recordData, recordName: RecordName, suggestion: iPayeeSuggestion): InferDataType<RecordName> => {
  let accountTypeAttribute: string; let payeeNameAttribute: string
  if(recordName === "allocation_preference") {
    accountTypeAttribute = "payee_account_type"
    payeeNameAttribute = "payee_name"
  } else if(recordName === "financial_attributes") {
    accountTypeAttribute = "bank_account_type"
    payeeNameAttribute = "bank_account_name"
  }
  recordData[accountTypeAttribute] = suggestion.account_type.toLowerCase()
  recordData[payeeNameAttribute] = suggestion.payee_name
  return recordData as InferDataType<typeof recordName>
}
