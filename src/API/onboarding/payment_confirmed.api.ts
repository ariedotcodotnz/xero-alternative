import { postJson, get } from "../config/fetch.api";
import BasicResponse from "../types/basicResponse.js";

export default interface getPayslipPathResponseBody extends BasicResponse {
  data: {
    payslip_path?: string;
  };
}

export const getPayslipPath = async (): Promise<getPayslipPathResponseBody> =>
  get(Routes.api_onboarding_payment_confirmed_path());

export const postPayslipPath = async (): Promise<BasicResponse> =>
  postJson(Routes.api_onboarding_payment_confirmed_path(), "", false);
