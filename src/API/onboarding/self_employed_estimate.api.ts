import { postJson } from "../config/fetch.api";
import { BasicResponse } from "../types/basicResponse";

export interface selfEmployedEstimateDto {
  estimate: number;
}

interface OnboardingResponseBody extends BasicResponse {
  data: {
    state: string;
  };
}

export const postSelfEmployedEstimate = async (
  selfEmployedEstimate: selfEmployedEstimateDto,
): Promise<OnboardingResponseBody> =>
  postJson(
    Routes.api_onboarding_self_employed_estimate_index_path(),
    JSON.stringify(selfEmployedEstimate),
    false,
  );
